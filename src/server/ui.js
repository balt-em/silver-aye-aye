import { v4 as uuid } from 'uuid';
import * as indexes from '@shared/sheetconfig';
import {
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
import {
  getClientSheet,
  getPaymentSheetValues,
  updatePaymentData,
} from './sheets';

import { getDate } from './utils';

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

export const addPaymentRecord = data => {
  const {
    paymentBreakdownData,
    rate,
    companyName,
    initials,
    datePaid,
  } = JSON.parse(data);
  const sheetValues = getPaymentSheetValues();
  const newPaymentRecord = Array(sheetValues[0].length);
  const paymentId = uuid();

  newPaymentRecord[PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = paymentId;
  newPaymentRecord[RATE_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = rate;
  newPaymentRecord[DATE_PAID_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = datePaid;
  newPaymentRecord[PAID_BY_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = initials;
  newPaymentRecord[COMPANY_NAME_INDEX_ON_PAYMENT_OVERVIEW_SHEET] = companyName;

  const formattedPaymentBreakdownData = paymentBreakdownData.map(client => {
    const { startDate, endDate, id, terminationDate } = client;
    const paidThroughDate = getDate(
      client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]
    );
    const eDate = getDate(endDate);
    const sDate = getDate(startDate);
    const tDate = getDate(terminationDate);
    const record = Array(5);
    record[CLIENT_ID_INDEX_ON_PAYMENT_SHEET] = id;
    record[PAYMENT_ID_INDEX_ON_PAYMENT_SHEET] = paymentId;
    if (!tDate || (tDate && tDate > eDate)) {
      record[START_DATE_INDEX_ON_PAYMENT_SHEET] = sDate;
      record[END_DATE_INDEX_ON_PAYMENT_SHEET] = eDate;
      record[REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET] = 'n';
    } else {
      record[START_DATE_INDEX_ON_PAYMENT_SHEET] = startDate;
      const reimbursementStartDate = new Date(
        paidThroughDate.valueOf() + 1000 * 3600 * 24
      );

      record[START_DATE_INDEX_ON_PAYMENT_SHEET] = tDate;
      record[END_DATE_INDEX_ON_PAYMENT_SHEET] = reimbursementStartDate;
      record[REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET] = 'y';
    }
    return record;
  });

  updatePaymentData(newPaymentRecord, formattedPaymentBreakdownData);
};
