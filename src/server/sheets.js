/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const [
  intakeFormSheetIndex,
  clientSheetIndex,
  paymentBreakdownSheetIndex,
  paymentOverviewSheetIndex,
] = [...Array(4).keys()];

const [
  clientIdIndexOnPaymentSheet,
  paymentIdIndexOnPaymentSheet,
  startDateIndexOnPaymentSheet,
  endDateIndexOnPaymentSheet,
  notesIndexOnPaymentSheet,
  totalIndexOnPaymentSheet,
  reimbursementIndexOnPaymentSheet,
] = [...Array(7).keys()];

const [
  paymentIdIndexOnPaymentOverview,
  rateIndexOnPaymentOverview,
  datePaidIndexOnPaymentOverview,
  paidByIndexOnPaymentOverview,
  reciptUrlIndexOnPaymentOverview,
  totalIndexOnPaymentOverview,
] = [...Array(6).keys()];

const [
  submittedOnIndexOnClientSheet,
  clientIdIndexOnClientSheet,
  clientsNameIndexOnClientSheet,
  totalPaidIndexOnClientSheet,
  numberOfDaysOwedIndexOnClientSheet,
  paymentPickupDateIndexOnClientSheet,
  paidThroughDateIndexOnClientSheet,
  reimbursementOwedIndexOnClientSheet,
  reimbursementUsedIndexOnClientSheet,
  terminationDateIndexOnClientSheet,
  emailIndexOnClientSheet,
  clientsPhoneNumberIndexOnClientSheet,
  bestWayToContactClientIndexOnClientSheet,
  clientsDateOfBirthIndexOnClientSheet,
  clientsNextCourtDateIndexOnClientSheet,
  caseNumberIndexOnClientSheet,
  attorneysNameIndexOnClientSheet,
  isRepresentationFromPublicDefenderOfficeIndexOnClientSheet,
  homeDetentionDompanyIndexOnClientSheet,
  whenClientHookedUpIndexOnClientSheet,
  whenClientWillBeHookedUpIndexOnClientSheet,
  knownDrugIssuesIndexOnClientSheet,
  healthIssuesIndexOnClientSheet,
  importantClientDetailsIndexOnClientSheet,
  infoForSomeoneFillingOutOnBehalfOfClientIndexOnClientSheet,
  confirmedPickupIndexOnClientSheet,
  rescheuledCourtDateIndexOnClientSheet,
  notesIndexOnClientSheet,
] = [...Array(27).keys()];
// TODO we need to figure out a better way to assigned sequential numbers for our rows
const spreadsheetUrl =
  'https://docs.google.com/spreadsheets/d/1GWh-B_IMmvNniy2p82CKQ9X-eepwx70BG50xCM5r2bo/edit#gid=0';

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function getDateDif(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = date1;
  const secondDate = date2;

  return Math.floor(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

// take a boolean 'useUrl', you have to use a URL if calling from the UI, and can't use one if the
// script being run is directly attached to a google sheet (aka onEdit)
function getSheets(useUrl) {
  if (useUrl) {
    return SpreadsheetApp.openByUrl(spreadsheetUrl).getSheets();
  }
  return SpreadsheetApp.getActive().getSheets();
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
    paymentRateDict[row[paymentIdIndexOnPaymentOverview]] =
      row[rateIndexOnPaymentOverview];
  });

  const paymentPickupDateDict = {};
  paymentBreakdownData.forEach(row => {
    // get the paymentBreakdown data, iterate through each row, return clientID, startDate, endDate
    const clientId = row[clientIdIndexOnPaymentSheet];
    const startDate = row[startDateIndexOnPaymentSheet];

    // Get the startDate already assigned to that id in the dictionary, if there is one
    const oldPaymentPickupDate = paymentPickupDateDict[clientId];
    // See if there was a startDate already assigned to that id in the dictionary
    if (!oldPaymentPickupDate) {
      paymentPickupDateDict[clientId] = startDate;
      // if there is no oldPaymentPickupDate then go to the startDate if the startDate is before the oldPaymentPickupDate then we want to go to the startDate
    } else if (oldPaymentPickupDate > startDate) {
      paymentPickupDateDict[clientId] = startDate;
    }

    const endDate = row[endDateIndexOnPaymentSheet];
  });
  //  get the earliest startDate

  const paidThroughDateDict = {};
  paymentBreakdownData.forEach(row => {
    // get the paymentBreakdown data, iterate through each row, return clientID, startDate, endDate
    const clientId = row[clientIdIndexOnPaymentSheet];
    const endDate = row[endDateIndexOnPaymentSheet];
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
  const amountOwedDict = {};

  paymentBreakdownData.forEach(row => {
    // calculate the paymentPickUpDate, paidThroughDate while looping through here
    const clientId = row[clientIdIndexOnPaymentSheet];
    const terminationDate = clientTerminationDateDict[clientId];
    const paymentId = row[paymentIdIndexOnPaymentSheet];
    const startDate = new Date(row[startDateIndexOnPaymentSheet]);
    const endDate = new Date(row[endDateIndexOnPaymentSheet]);
    const reimbursement = row[reimbursementIndexOnPaymentSheet];

    const dateDif = getDateDif(startDate, endDate);
    const rate = paymentRateDict[paymentId];

    if (terminationDate && terminationDate < endDate) {
      const daysOverpaid = getDateDif(terminationDate, endDate);
      clientReimbursementOwedDict[clientId] = daysOverpaid * rate;
    }

    let cost = dateDif * rate;
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
  });

  const daysOwedForClientDict = {};
  clientData.forEach(row => {
    const clientId = row[clientIdIndexOnClientSheet];
    const terminationDate = clientTerminationDateDict[clientId];
    const paymentDueThroughDate = terminationDate || new Date();
    const paidThroughDate = paidThroughDateDict[clientId];
    // don't want to include the date you paid through
    const dateDif = getDateDif(paymentDueThroughDate, paidThroughDate) - 1;
    if (dateDif >= 1 && paidThroughDate < paymentDueThroughDate) {
      daysOwedForClientDict[clientId] = dateDif;
    }
  });

  const clientSheet = sheets[clientSheetIndex];
  const clientSheetDataRange = clientSheet
    .getDataRange()
    .getValues()
    .slice(1);
  const paymentOverviewSheet = sheets[paymentOverviewSheetIndex];
  const paymentOverviewSheetDataRange = sheets[paymentOverviewSheetIndex]
    .getDataRange()
    .getValues()
    .slice(1);

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    daysOwedForClientDict,
    clientIdIndexOnClientSheet,
    numberOfDaysOwedIndexOnClientSheet
  );

  updateColumnFromDictionary(
    paymentOverviewSheet,
    paymentOverviewSheetDataRange,
    paymentTotalCostDict,
    paymentIdIndexOnPaymentOverview,
    totalIndexOnPaymentOverview
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    reimbursementUsedDict,
    clientIdIndexOnClientSheet,
    reimbursementUsedIndexOnClientSheet
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    clientTotalCostDict,
    clientIdIndexOnClientSheet,
    totalPaidIndexOnClientSheet
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    clientReimbursementOwedDict,
    clientIdIndexOnClientSheet,
    reimbursementOwedIndexOnClientSheet
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    paymentPickupDateDict,
    clientIdIndexOnClientSheet,
    paymentPickupDateIndexOnClientSheet
  );

  updateColumnFromDictionary(
    clientSheet,
    clientSheetDataRange,
    paidThroughDateDict,
    clientIdIndexOnClientSheet,
    paidThroughDateIndexOnClientSheet
  );
  // daysOwedForClientDict tells us who we owe for
  // clientReimbursementOwedDict tell us who we are owed for
  // need to figure out who to pay for, also should this be cleaned up?
}

// return { id: terminationDate }
function getClientTerminationDateDict(clientData) {
  const clientTerminationDateDict = {};
  clientData.forEach(row => {
    const terminationDate = row[terminationDateIndexOnClientSheet];
    if (terminationDate) {
      const clientId = row[clientIdIndexOnClientSheet];
      clientTerminationDateDict[clientId] = new Date(terminationDate);
    }
  });

  return clientTerminationDateDict;
}

export const onEdit = e => {
  console.time('onEdit time');
  const sheets = getSheets(false);
  const sheetValues = sheets.map(sheet =>
    sheet
      .getDataRange()
      .getValues()
      .slice(1)
  );
  const clientData = sheetValues[clientSheetIndex];
  const paymentBreakdownData = sheetValues[paymentBreakdownSheetIndex];
  const paymentOverviewData = sheetValues[paymentOverviewSheetIndex];

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

export const getClientData = () => {
  // const activeSheetName = getActiveSheetName();
  return getSheets(true)
    [clientSheetIndex].getDataRange()
    .getValues();
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

export const getSheetValues = () => {
  // const activeSheetName = getActiveSheetName();
  return getSheets().map(sheet => {
    const name = sheet.getName();
    console.log('sheet.getDataRange()', sheet.getDataRange());
    return {
      name,
      data: sheet.getDataRange(),
      values: sheet.getDataRange().getValues(),
    };
  });
};

export const addSheet = sheetTitle => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = sheetIndex => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = sheetName => {
  SpreadsheetApp.getActive()
    .getSheetByName(sheetName)
    .activate();
  return getSheetsData();
};
