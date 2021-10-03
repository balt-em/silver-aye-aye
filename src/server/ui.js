import { v4 as uuid } from 'uuid';
import * as indexes from '@shared/sheetconfig';
import {
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  CLIENT_ID_INDEX_ON_PAYMENT_SHEET,
  PAYMENT_ID_INDEX_ON_PAYMENT_SHEET,
  START_DATE_INDEX_ON_PAYMENT_SHEET,
  END_DATE_INDEX_ON_PAYMENT_SHEET,
  REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET,
  NOTES_INDEX_ON_PAYMENT_SHEET,
  TOTAL_PAID_INDEX_ON_CLIENT_SHEET,
  HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
  PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  RATE_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  COMPANY_NAME_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  DATE_PAID_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  PAID_BY_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import { getDate } from '@shared/utils';
import {
  CLIENT_SHEET_INDEX,
  getClientSheet,
  getPaymentSheetValues,
  onEdit,
  updatePaymentData,
  getSheet,
  setSheetRow,
} from './sheets';

// eslint-disable-next-line import/prefer-default-export
export const doGet = () => {
  const title = 'Silver Aye Aye';
  const fileName = 'webapp.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
};

export const getTotalsAndClientData = () => {
  const clientSheet = getClientSheet();
  const clientData = clientSheet.slice(1);
  let numClientsServed = 0;
  let totalPaid = 0;
  const companyData = {
    ASAP: {
      reimbursementsOwed: 0,
      daysOwed: 0,
    },
    ALERT: {
      reimbursementsOwed: 0,
      daysOwed: 0,
    },
    Other: {
      reimbursementsOwed: 0,
      daysOwed: 0,
    },
  };
  clientData.forEach(client => {
    const amountPaid = client[TOTAL_PAID_INDEX_ON_CLIENT_SHEET];
    if (amountPaid && amountPaid > 0) {
      numClientsServed += 1;
    }
    if (amountPaid) {
      totalPaid += amountPaid;
    }

    let clientCompany = client[HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET];

    if (clientCompany !== 'ASAP' && clientCompany !== 'ALERT') {
      clientCompany = 'Other';
    }
    const clientReimbursementOwed =
      client[REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET];
    const clientDaysOwed = client[NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET];

    if (clientReimbursementOwed) {
      companyData[clientCompany].reimbursementsOwed += clientReimbursementOwed;
    }
    if (clientDaysOwed) {
      companyData[clientCompany].daysOwed += clientDaysOwed;
    }
  });

  const totals = {
    totalPaid,
    numClientsServed,
    ASAP: companyData.ASAP,
    ALERT: companyData.ALERT,
  };

  return JSON.stringify({
    clientData: clientSheet,
    totals,
  });
};

export const getClientPaymentData = () => {
  const sheetValues = getPaymentSheetValues();
  const clientPaymentData = {};
  sheetValues.forEach(row => {
    const index = row[indexes.CLIENT_ID_INDEX_ON_PAYMENT_SHEET];
    if (clientPaymentData[index]) {
      clientPaymentData[index] = [row, ...clientPaymentData[index]];
    } else {
      clientPaymentData[index] = [row];
    }
  });

  return JSON.stringify(clientPaymentData);
};

export const updateClientData = clients => {
  const clientSheet = getSheet(CLIENT_SHEET_INDEX);
  const clientSheetValues = clientSheet.getDataRange().getValues();
  const clientSheetIndexMap = {};
  clientSheetValues.forEach((client, index) => {
    clientSheetIndexMap[client[CLIENT_ID_INDEX_ON_CLIENT_SHEET]] = index;
  });
  clients.forEach(client => {
    const clientId = client[CLIENT_ID_INDEX_ON_CLIENT_SHEET];
    const indexOnClientSheet = clientSheetIndexMap[clientId];
    const currentRow = clientSheetValues[indexOnClientSheet];
    currentRow[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET] = getDate(
      client.terminationDate
    );
    setSheetRow(clientSheet, indexOnClientSheet, currentRow);
  });
};

export const addPaymentRecord = data => {
  const {
    paymentBreakdownData,
    rate,
    companyName,
    initials,
    datePaid,
  } = JSON.parse(data);
  updateClientData(paymentBreakdownData);

  const sheetValues = getPaymentSheetValues();
  const paymentId = uuid();

  const newPaymentRecord = Array(sheetValues[0].length);
  newPaymentRecord[PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = paymentId;
  newPaymentRecord[RATE_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = rate;
  newPaymentRecord[DATE_PAID_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = getDate(
    datePaid
  );
  newPaymentRecord[PAID_BY_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = initials;
  newPaymentRecord[COMPANY_NAME_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = companyName;

  const formattedPaymentBreakdownData = paymentBreakdownData.map(client => {
    const { startDate, endDate, id, terminationDate } = client;
    const paidThroughDate =
      client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET] &&
      getDate(client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]);
    const eDate = endDate && getDate(endDate);
    const sDate = endDate && getDate(startDate);
    const tDate = terminationDate && getDate(terminationDate);
    const record = Array(5);
    record[CLIENT_ID_INDEX_ON_PAYMENT_SHEET] = id;
    record[PAYMENT_ID_INDEX_ON_PAYMENT_SHEET] = paymentId;
    if (startDate && endDate) {
      record[START_DATE_INDEX_ON_PAYMENT_SHEET] = sDate;
      record[END_DATE_INDEX_ON_PAYMENT_SHEET] = eDate;
      record[REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET] = 'n';
    } else if (
      terminationDate &&
      paidThroughDate &&
      terminationDate < paidThroughDate
    ) {
      record[START_DATE_INDEX_ON_PAYMENT_SHEET] = tDate;
      record[END_DATE_INDEX_ON_PAYMENT_SHEET] = paidThroughDate;
      record[REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET] = 'y';
    }
    return record;
  });

  updatePaymentData(newPaymentRecord, formattedPaymentBreakdownData);
  onEdit();
};
