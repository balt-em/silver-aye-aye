/* eslint-disable no-console */

import {
  SPREADSHEET_URL,
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  TOTAL_PAID_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
  PAYMENT_PICKUP_DATE_INDEX_ON_CLIENT_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_USED_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  CLIENT_ID_INDEX_ON_PAYMENT_SHEET,
  PAYMENT_ID_INDEX_ON_PAYMENT_SHEET,
  START_DATE_INDEX_ON_PAYMENT_SHEET,
  END_DATE_INDEX_ON_PAYMENT_SHEET,
  REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET,
  PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  RATE_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  TOTAL_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
  CLIENT_SHEET_INDEX,
  PAYMENT_BREAKDOWN_SHEET_INDEX,
  PAYMENT_OVERVIEW_SHEET_INDEX,
} from '@shared/sheetconfig';
import { getDate } from '@shared/utils';

// take a boolean 'useUrl', you have to use a URL if calling from the UI, and can't use one if the
// script being run is directly attached to a google sheet (aka onEdit)
export function getSheets(useUrl) {
  if (useUrl) {
    console.log('SPREADSHEET_URL', SPREADSHEET_URL);
    return SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheets();
  }
  return SpreadsheetApp.getActive().getSheets();
}

export const getSheet = (index, useUrl) => {
  return getSheets(useUrl)[index];
};

export const getSheetValues = sheet => {
  return sheet
    .getDataRange()
    .getValues()
    .slice(1);
};

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
// the difference between two dates including the start OR the end date: 1/1 - 1/1 is 0 days
function getDateDifExclusive(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = date1;
  const secondDate = date2;

  return Math.floor(Math.abs((firstDate - secondDate) / oneDay));
}

// the difference between two dates including the start and end date:  1/1 - 1/1 is 1 day
function getDateDifInclusive(date1, date2) {
  return getDateDifExclusive(date1, date2) + 1;
}

// takes a google sheet, and a dictionary going from some id to a value, a columnWithIdsIndex in the sheet,
// and a columnToUpdateIndex which says which column to update with the values
// Only works if those IDs are unique in that sheet, otherwise it'll update all the matching ids with the same value in the dictionary
// AKA Can't use on the paymentBreakdownSheet because the value will get set to multiple ids
function updateColumnFromDictionary(
  sheet,
  sheetValues,
  dictionary,
  columnWithIdsIndex,
  columnToUpdateIndex
) {
  const dataRange = sheet.getRange(
    2,
    columnToUpdateIndex + 1,
    sheet.getLastRow() - 1,
    1
  );

  const valuesToSetToSheet = sheetValues.map(row => {
    const id = row[columnWithIdsIndex];
    const value = dictionary[id];
    return [value];
  });
  dataRange.setValues(valuesToSetToSheet);
}

function updateTotalCosts(
  sheets,
  clientData,
  paymentBreakdownData,
  paymentOverviewData,
  clientTerminationDateDict
) {
  // for each item in payment overview, add to dictionary paymentId: rate

  const paymentRateDict = {};

  paymentOverviewData.forEach(row => {
    paymentRateDict[row[PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET]] =
      row[RATE_INDEX_ON_PAYMENT_OVERVIEW_SHEET];
  });

  const paymentPickupDateDict = {};
  paymentBreakdownData.forEach(row => {
    // get the paymentBreakdown data, iterate through each row, return clientID, startDate, endDate
    const clientId = row[CLIENT_ID_INDEX_ON_PAYMENT_SHEET];
    const startDate = row[START_DATE_INDEX_ON_PAYMENT_SHEET];

    // Get the startDate already assigned to that id in the dictionary, if there is one
    const oldPaymentPickupDate = paymentPickupDateDict[clientId];
    // See if there was a startDate already assigned to that id in the dictionary
    if (!oldPaymentPickupDate) {
      paymentPickupDateDict[clientId] = startDate;
      // if there is no oldPaymentPickupDate then go to the startDate if the startDate is before the oldPaymentPickupDate then we want to go to the startDate
    } else if (oldPaymentPickupDate > startDate) {
      paymentPickupDateDict[clientId] = startDate;
    }
  });
  //  get the earliest startDate

  const paidThroughDateDict = {};
  paymentBreakdownData.forEach(row => {
    // get the paymentBreakdown data, iterate through each row, return clientID, startDate, endDate
    const clientId = row[CLIENT_ID_INDEX_ON_PAYMENT_SHEET];
    const endDate = row[END_DATE_INDEX_ON_PAYMENT_SHEET];
    const oldPaidThroughDate = paidThroughDateDict[clientId];
    // See if there was a startDate already assigned to that id in the dictionary
    if (!oldPaidThroughDate) {
      paidThroughDateDict[clientId] = endDate;
      // if there is no oldPaymentPickupDate then go to the startDate if the startDate is before the oldPaymentPickupDate then we want to go to the startDate
    } else if (oldPaidThroughDate < endDate) {
      paidThroughDateDict[clientId] = endDate;
    }
  });

  const paymentTotalCostDict = {};
  const clientTotalCostDict = {};
  const clientReimbursementOwedDict = {};
  const reimbursementUsedDict = {};

  paymentBreakdownData.forEach(row => {
    // calculate the paymentPickUpDate, paidThroughDate while looping through here
    const clientId = row[CLIENT_ID_INDEX_ON_PAYMENT_SHEET];
    const terminationDate = clientTerminationDateDict[clientId];
    const paymentId = row[PAYMENT_ID_INDEX_ON_PAYMENT_SHEET];
    const startDate = getDate(row[START_DATE_INDEX_ON_PAYMENT_SHEET]);
    const endDate = getDate(row[END_DATE_INDEX_ON_PAYMENT_SHEET]);
    const reimbursement = row[REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET];

    const inclusiveDateDif = getDateDifInclusive(startDate, endDate);
    const rate = paymentRateDict[paymentId];

    let cost = inclusiveDateDif * rate;
    if (reimbursement === 'y') {
      cost = -cost;
      reimbursementUsedDict[clientId] = cost;
      if (clientReimbursementOwedDict[clientId]) {
        clientReimbursementOwedDict[clientId] += cost;
      } else {
        clientReimbursementOwedDict[clientId] = cost;
      }
    }

    if (paymentTotalCostDict[paymentId]) {
      paymentTotalCostDict[paymentId] += cost;
    } else {
      paymentTotalCostDict[paymentId] = cost;
    }

    if (clientTotalCostDict[clientId]) {
      clientTotalCostDict[clientId] += cost;
    } else {
      clientTotalCostDict[clientId] = cost;
    }

    if (reimbursement === 'n' && terminationDate && terminationDate < endDate) {
      let amountToReimburse = cost;
      if (startDate < terminationDate) {
        const daysOverpaid = getDateDifExclusive(terminationDate, endDate);
        amountToReimburse = daysOverpaid * rate;
      }
      if (clientReimbursementOwedDict[clientId]) {
        clientReimbursementOwedDict[clientId] += amountToReimburse;
      } else {
        clientReimbursementOwedDict[clientId] = amountToReimburse;
      }
    }
  });

  const daysOwedForClientDict = {};
  clientData.forEach(row => {
    const clientId = row[CLIENT_ID_INDEX_ON_CLIENT_SHEET];
    const terminationDate = clientTerminationDateDict[clientId];
    const paymentDueThroughDate = terminationDate || getDate();
    const paidThroughDate = paidThroughDateDict[clientId];
    // don't want to include the date you paid through
    const dateDif = getDateDifExclusive(paymentDueThroughDate, paidThroughDate);
    if (dateDif >= 1 && paidThroughDate < paymentDueThroughDate) {
      daysOwedForClientDict[clientId] = dateDif;
    }
  });

  const clientSheet = sheets[CLIENT_SHEET_INDEX];
  const clientSheetDataRange = clientSheet
    .getDataRange()
    .getValues()
    .slice(1);
  const paymentOverviewSheet = sheets[PAYMENT_OVERVIEW_SHEET_INDEX];
  const paymentOverviewSheetDataRange = sheets[
    PAYMENT_OVERVIEW_SHEET_INDEX
  ].getDataRange()
    .getValues()
    .slice(1);

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    daysOwedForClientDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET
  );

  updateColumnFromDictionary(
    paymentOverviewSheet,
    paymentOverviewSheetDataRange,
    paymentTotalCostDict,
    PAYMENT_ID_INDEX_ON_PAYMENT_OVERVIEW_SHEET,
    TOTAL_INDEX_ON_PAYMENT_OVERVIEW_SHEET
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    reimbursementUsedDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    REIMBURSEMENT_USED_INDEX_ON_CLIENT_SHEET
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    clientTotalCostDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    TOTAL_PAID_INDEX_ON_CLIENT_SHEET
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    clientReimbursementOwedDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    paymentPickupDateDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    PAYMENT_PICKUP_DATE_INDEX_ON_CLIENT_SHEET
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    paidThroughDateDict,
    CLIENT_ID_INDEX_ON_CLIENT_SHEET,
    PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET
  );
  // daysOwedForClientDict tells us who we owe for
  // clientReimbursementOwedDict tell us who we are owed for
  // need to figure out who to pay for, also should this be cleaned up?
}

// return { id: terminationDate }
function getClientTerminationDateDict(clientData) {
  const clientTerminationDateDict = {};
  clientData.forEach(row => {
    const terminationDate = row[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET];
    if (terminationDate) {
      const clientId = row[CLIENT_ID_INDEX_ON_CLIENT_SHEET];
      clientTerminationDateDict[clientId] = getDate(terminationDate);
    }
  });

  return clientTerminationDateDict;
}

export const onEdit = e => {
  console.time('onEdit time');
  console.log('onEdit,  range', e);
  const sheets = getSheets(false);
  const sheetValues = sheets.map(sheet =>
    sheet
      .getDataRange()
      .getValues()
      .slice(1)
  );
  const clientData = sheetValues[CLIENT_SHEET_INDEX];
  const paymentBreakdownData = sheetValues[PAYMENT_BREAKDOWN_SHEET_INDEX];
  const paymentOverviewData = sheetValues[PAYMENT_OVERVIEW_SHEET_INDEX];

  const clientTerminationDateDict = getClientTerminationDateDict(clientData);

  updateTotalCosts(
    sheets,
    clientData,
    paymentBreakdownData,
    paymentOverviewData,
    clientTerminationDateDict
  );
  console.timeEnd('onEdit time');
};

export const getSheetsData = () => {
  // const activeSheetName = getActiveSheetName();
  return getSheets(true).map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      // isActive: name === activeSheetName,
    };
  });
};

export const getClientSheet = () => {
  const clientSheet = getSheets(true)[CLIENT_SHEET_INDEX];
  return clientSheet.getDataRange().getValues();
};

export const updatePaymentData = (paymentOverviewRow, paymentBreakdownData) => {
  const sheets = getSheets(true);
  const paymentOverviewSheet = sheets[PAYMENT_OVERVIEW_SHEET_INDEX];
  const paymentBreakdownSheet = sheets[PAYMENT_BREAKDOWN_SHEET_INDEX];

  paymentOverviewSheet.appendRow(paymentOverviewRow);

  const lastRow = paymentBreakdownSheet.getLastRow();
  const dataRange = paymentBreakdownSheet.getRange(
    lastRow + 1,
    1,
    paymentBreakdownData.length,
    paymentBreakdownData[0].length
  );
  dataRange.setValues(paymentBreakdownData);
  // return clientSheet.getDataRange().getValues();
};

export const setSheetValues = (sheet, formattedData) => {
  const dataRange = sheet.getRange(
    2,
    1,
    formattedData.length,
    formattedData[0].length
  );

  dataRange.setValues(formattedData);
};

export const setSheetRow = (sheet, index, data) => {
  const dataRange = sheet.getRange(index + 1, 1, 1, data.length);
  console.log('index + 1, 1, 1, data.length', index + 1, 1, 1, data.length);
  console.log('data', data);

  dataRange.setValues([data]);
};

export const getPaymentSheetValues = () => {
  const clientSheet = getSheets(true)[PAYMENT_BREAKDOWN_SHEET_INDEX];
  return clientSheet
    .getDataRange()
    .getValues()
    .slice(1);
};
