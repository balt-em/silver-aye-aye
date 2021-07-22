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
  paidThroughDateIndexOnClientSheet,
  paymentPickupDateIndexOnClientSheet,
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
  dictionary,
  columnWithIdsIndex,
  columnToUpdateIndex
) {
  const sheetValues = sheet
    .getDataRange()
    .getValues()
    .slice(1);

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

  console.log(paymentRateDict);

  const paymentStartDateDataDict = {};
  paymentBreakdownData.forEach(row => {
    // get the paymentBreakdown data, iterate through each row, return clientID, startDate, endDate
    const clientId = row[clientIdIndexOnPaymentSheet];
    const startDate = row[startDateIndexOnPaymentSheet];

    // Get the startDate already assigned to that id in the dictionary, if there is one
    const oldStartDate = paymentStartDateDataDict[clientId];
    // See if there was a startDate already assigned to that id in the dictionary
    if (oldStartDate) {
      // if the oldStartDate is greater than the startDate
      if (oldStartDate > startDate) {
        // assign the startDate to the dictionary
        paymentStartDateDataDict[clientId] = startDate;
      } else {
        // else assign the oldStartDate to the dictionary
        paymentStartDateDataDict[clientId] = oldStartDate;
      }
    } else {
      paymentStartDateDataDict[clientId] = startDate;
    }

    // get the earliest start date for each clientId
    // clientId = paymentStartDateDataDict[startDate];
    const endDate = row[endDateIndexOnPaymentSheet];
  });
  // get the earliest startDate
  // console.log('Showuphere', paymentStartDateDataDict);

  // TODO: FAKE DATA, get the real data above
  const paidThroughDateDict = {
    892: new Date('5/21/21'),
    131: new Date('7/20/21'),
    456: new Date('5/21/21'),
    111: undefined,
    123: new Date('5/21/21'),
  };

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

    console.log(clientId, paymentId, startDate, endDate, reimbursement);

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
  console.log('daysOwedForClientDict', daysOwedForClientDict);

  updateColumnFromDictionary(
    sheets[clientSheetIndex],
    daysOwedForClientDict,
    clientIdIndexOnClientSheet,
    numberOfDaysOwedIndexOnClientSheet
  );

  updateColumnFromDictionary(
    sheets[paymentOverviewSheetIndex],
    paymentTotalCostDict,
    paymentIdIndexOnPaymentOverview,
    totalIndexOnPaymentOverview
  );

  updateColumnFromDictionary(
    sheets[clientSheetIndex],
    reimbursementUsedDict,
    clientIdIndexOnClientSheet,
    reimbursementUsedIndexOnClientSheet
  );

  updateColumnFromDictionary(
    sheets[clientSheetIndex],
    clientTotalCostDict,
    clientIdIndexOnClientSheet,
    totalPaidIndexOnClientSheet
  );

  updateColumnFromDictionary(
    sheets[clientSheetIndex],
    clientReimbursementOwedDict,
    clientIdIndexOnClientSheet,
    reimbursementOwedIndexOnClientSheet
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

  console.log('clientTerminationDateDict', clientTerminationDateDict);

  updateTotalCosts(
    sheets,
    clientData,
    paymentBreakdownData,
    paymentOverviewData,
    clientTerminationDateDict
  );
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
