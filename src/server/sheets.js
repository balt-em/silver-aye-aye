/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */

const [
  intakeFormSheetIndex,
  clientSheetIndex,
  paymentBreakdownSheetIndex,
  paymentOverviewSheetIndex,
] = [0, 1, 2, 3];

const [
  paymentIdIndexOnPaymentOverview,
  rateIndexOnPaymentOverview,
  datePaidIndexOnPaymentOverview,
  paidByIndexOnPaymentOverview,
  reciptUrlIndexOnPaymentOverview,
  totalIndexOnPaymentOverview,
] = [0, 1, 2, 3, 4, 5];

const spreadsheetUrl =
  'https://docs.google.com/spreadsheets/d/1GWh-B_IMmvNniy2p82CKQ9X-eepwx70BG50xCM5r2bo/edit#gid=0';

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function getDateDif(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSheets(url) {
  if (url) {
    return SpreadsheetApp.openByUrl(spreadsheetUrl).getSheets();
  }
  return SpreadsheetApp.getActive().getSheets();
}

// function getActiveSheetName(url) {
//   if (url) {
//     return SpreadsheetApp.openByUrl(url).getSheetName();
//   }
//   return SpreadsheetApp.getActive()
//     .getSheets()
//     .getSheetName();
// }

export const onEdit = e => {
  console.log('you edited the thing', e);

  const sheets = getSheets(false);
  const sheetValues = sheets.map(sheet => sheet.getDataRange().getValues());
  const [_, _a, paymentBreakdownData, paymentOverviewData] = sheetValues; // TODO: use indexes

  // for each item in payment overview, add to dictionary paymentId: rate
  paymentOverviewData.shift(); // removes first element
  const paymentRateDict = {};

  paymentOverviewData.forEach(row => {
    paymentRateDict[paymentIdIndexOnPaymentOverview] =
      row[rateIndexOnPaymentOverview];
  });

  console.log(paymentRateDict);

  paymentBreakdownData.shift();
  const paymentTotalCostDict = {};
  const clientTotalCostDict = {};

  paymentBreakdownData.forEach(row => {
    const [clientId, paymentId, startDate, endDate] = row; // TODO: use indexes
    const dateDif = getDateDif(startDate, endDate);
    const rate = paymentRateDict[paymentId];
    const cost = dateDif * rate;

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

  const paymentOverviewSheet = sheets[paymentOverviewSheetIndex]; // get payment overview sheet
  const totalsRange = paymentOverviewSheet.getRange(
    2,
    totalIndexOnPaymentOverview,
    paymentOverviewSheet.getLastRow() - 1,
    1
  );

  const paymentTotals = paymentOverviewData.map(row => {
    const paymentId = row[paymentIdIndexOnPaymentOverview];
    const cost = paymentTotalCostDict[paymentId];
    return [cost];
  });
  // payment total might look like this [ [620], [320], [1056] ]

  totalsRange.setValues(paymentTotals);

  // make a new dictionary paymentId: total paid in that payment
  // make a new dictionary clientId: total paid on behalf of that client
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
