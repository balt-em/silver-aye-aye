import * as indexes from '@shared/sheetconfig';
import {
  TOTAL_PAID_INDEX_ON_CLIENT_SHEET,
  HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import { getClientSheet, getPaymentSheetValues } from './sheets';

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
