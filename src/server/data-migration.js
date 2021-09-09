/* eslint-disable no-unused-vars */
/* eslint-disable import/first */
import getRandomValues from 'polyfill-crypto.getrandomvalues';
import { CLIENT_NAME_INDEX_ON_INTAKE_FORM } from '@shared/sheetconfig';
import * as indexes from '@shared/sheetconfig';
import {
  getSheets,
  getSheetValues,
  setSheetValues,
  INTAKE_FORM_SHEET_INDEX,
  CLIENT_SHEET_INDEX,
  PAYMENT_BREAKDOWN_SHEET_INDEX,
  PAYMENT_OVERVIEW_SHEET_INDEX,
} from './sheets';

global.crypto = {
  getRandomValues,
};

// eslint-disable-next-line import/order
import { v4 as uuidv4 } from 'uuid';

const [
  NAME_INDEX_ON_BALT_PAYMENT_SHEET,
  CASE_NUMBER_INDEX_ON_BALT_PAYMENT_SHEET,
  REPRESENTATION_INDEX_ON_BALT_PAYMENT_SHEET,
  STILL_PAYING_INDEX_ON_BALT_PAYMENT_SHEET,
  GENERAL_NOTES_INDEX_ON_BALT_PAYMENT_SHEET,
  DOB_INDEX_ON_BALT_PAYMENT_SHEET,
  COMPANY_INDEX_ON_BALT_PAYMENT_SHEET,
  HOOKUPDATE_INDEX_ON_BALT_PAYMENT_SHEET,
  PAYMENT_PICKUP_DATE_INDEX_ON_BALT_PAYMENT_SHEET,
] = [...Array(9).keys()];

const [
  PAY_START_DATE_INDEX_FOR_PAYMENT_DATA,
  PAY_END_DATE_INDEX_FOR_PAYMENT_DATA,
  NUM_DAYS_INDEX_FOR_PAYMENT_DATA,
  RATE_INDEX_FOR_PAYMENT_DATA,
  TOTAL_TO_PAY_INDEX_FOR_PAYMENT_DATA,
  PAID_INDEX_FOR_PAYMENT_DATA,
  DATE_PAID_INDEX_FOR_PAYMENT_DATA,
  PAID_BY_INDEX_FOR_PAYMENT_DATA,
  NOTES_INDEX_FOR_PAYMENT_DATA,
] = [...Array(9).keys()];

export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('BALT Data Migrator') // edit me!
    .addItem('Migrate Data', 'migrateData');

  menu.addToUi();
};

const formatIndividualClientData = (uuid, clientData) => {
  const [submittedOn, clientName, ...remainingIntakeData] = clientData; // <--- SEE ABOVE COMMENT
  return [
    uuid,
    submittedOn,
    clientName,
    ...Array(7), // leave blank space for calculated columns and termination date
    ...remainingIntakeData,
  ];
};

// IMPORTANT!!!:: update this if column ordering changes and migration is needed
const setClientSheetData = (intakeFormData, clientSheet) => {
  const clientNameToIdMap = {};
  const formattedData = intakeFormData.map(row => {
    const uuid = uuidv4();
    const [submittedOn, clientName, ...remainingIntakeData] = row; // <--- SEE ABOVE COMMENT
    clientNameToIdMap[clientName] = uuid;
    return [
      uuid,
      submittedOn,
      clientName,
      ...Array(7), // leave blank space for calculated columns and termination date
      ...remainingIntakeData,
    ];
  });

  setSheetValues(clientSheet, formattedData);
  return formattedData;
};

// Input
// [{
//   startDate:
//   endDate:
//   clientId,
//   rate,
//   datePaid:
//   notes:
//   paidBy:
//   company:
// }]
// group the payments made on the same day into a payment
// Output
// {
//   rate: payment.rate,
//   datePaid: payment.datePaid,
//   company: payment.company,
//   id: uuidv4(),
//   payments: where payment is the payments from input
// };
const groupPaymentData = paymentData => {
  const paymentsGroupedByDate = {};
  paymentData.forEach(payment => {
    const paymentDate = new Date(payment.datePaid);
    const dateString = `${paymentDate.getMonth() +
      1}/${paymentDate.getDate()}/${paymentDate.getFullYear()}`;

    if (!paymentsGroupedByDate[dateString]) {
      paymentsGroupedByDate[dateString] = {
        rate: payment.rate,
        datePaid: payment.datePaid,
        company: payment.company,
        id: uuidv4(),
        paidBy: payment.paidBy,
        payments: [payment],
      };
    } else {
      paymentsGroupedByDate[dateString].payments.push(payment);
    }
  });
  return paymentsGroupedByDate;
};

const matchClientDataWithPaymentData = (intakeFormValues, asapSheetValues) => {
  const matchedValues = [];
  const asapMap = {};
  asapSheetValues.forEach(row => {
    const name = row[NAME_INDEX_ON_BALT_PAYMENT_SHEET];
    if (row[STILL_PAYING_INDEX_ON_BALT_PAYMENT_SHEET] !== 'Duplicate Request') {
      asapMap[name] = row;
    }
  });
  const paymentData = []; // {clientId, startDate, endDate, rate, datePaid, paidBy, Notes}
  const formattedIntakeFormData = [];

  intakeFormValues.forEach(intakeFormRow => {
    const matchingAsapRow =
      asapMap[intakeFormRow[CLIENT_NAME_INDEX_ON_INTAKE_FORM]];
    if (matchingAsapRow) {
      // if none, it's a duplicate so we won't use it

      const clientId = uuidv4();
      formattedIntakeFormData.push(
        formatIndividualClientData(clientId, intakeFormRow)
      );

      const paymentsForClient = matchingAsapRow.slice(
        PAYMENT_PICKUP_DATE_INDEX_ON_BALT_PAYMENT_SHEET + 1
      );

      let i;
      let j;
      const columnsInPayment = 9; // MAGIC NUMBER!!! THIS CHANGES WITH NUMBER OF COLUMNS FOR EACH PAYMENT
      for (i = 0, j = paymentsForClient.length; i < j; i += columnsInPayment) {
        const payment = paymentsForClient.slice(i, i + columnsInPayment);
        if (payment[RATE_INDEX_FOR_PAYMENT_DATA]) {
          const paymentObj = {
            startDate: payment[PAY_START_DATE_INDEX_FOR_PAYMENT_DATA],
            endDate: payment[PAY_END_DATE_INDEX_FOR_PAYMENT_DATA],
            clientId,
            rate: payment[RATE_INDEX_FOR_PAYMENT_DATA],
            datePaid: payment[DATE_PAID_INDEX_FOR_PAYMENT_DATA],
            notes: payment[NOTES_INDEX_FOR_PAYMENT_DATA],
            paidBy: payment[PAID_BY_INDEX_FOR_PAYMENT_DATA],
            company: 'ASAP', // change for ALERT
          };
          paymentData.push(paymentObj);
        }
      }
    }
  });

  const groupedPaymentData = groupPaymentData(paymentData);
  const formattedPaymentOverviewData = [];
  const formattedPaymentBreakdownData = [];
  Object.keys(groupedPaymentData).forEach(key => {
    const payment = groupedPaymentData[key];
    // Payment Id	Rate/Day	Date Paid	Paid by
    const formattedPayment = [payment.id, payment.rate, key, payment.paidBy];
    formattedPaymentOverviewData.push(formattedPayment);
    const { payments } = payment;
    // Client Id	Payment Id	Start Date	End Date	Reimbursement?	Notes
    payments.forEach(paymentBreakdown => {
      formattedPaymentBreakdownData.push([
        paymentBreakdown.clientId,
        payment.id,
        paymentBreakdown.startDate,
        paymentBreakdown.endDate,
        'n',
        paymentBreakdown.notes,
      ]);
    });
  });
  // console.log('formattedPaymentOverviewData', formattedPaymentOverviewData);
  // console.log('formattedPaymentBreakdownData', formattedPaymentBreakdownData);

  return {
    formattedPaymentOverviewData,
    formattedPaymentBreakdownData,
    formattedIntakeFormData,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const migrateData = () => {
  console.log('migrate the DATA!!!');
  const sheets = getSheets();
  // get data from the intake form
  const intakeSheet = sheets[INTAKE_FORM_SHEET_INDEX];
  const clientSheet = sheets[CLIENT_SHEET_INDEX];
  const paymentBreakdownSheet = sheets[PAYMENT_BREAKDOWN_SHEET_INDEX];
  const paymentOverviewSheet = sheets[PAYMENT_OVERVIEW_SHEET_INDEX];

  const intakeFormValues = getSheetValues(intakeSheet);
  const asapSheetValues = getSheetValues(sheets[4]);
  // const alertSheetValues = getSheetValues(sheets[5]);
  const formattedData = matchClientDataWithPaymentData(
    intakeFormValues,
    asapSheetValues
  );

  setSheetValues(clientSheet, formattedData.formattedIntakeFormData);
  setSheetValues(
    paymentOverviewSheet,
    formattedData.formattedPaymentOverviewData
  );
  setSheetValues(
    paymentBreakdownSheet,
    formattedData.formattedPaymentBreakdownData
  );
  // Then repeat for alert ^^
};
