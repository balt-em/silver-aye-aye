import * as indexes from '@shared/sheetconfig';
import { getClientSheetValues, getPaymentSheetValues } from './sheets';

// eslint-disable-next-line import/prefer-default-export
export const doGet = () => {
  const title = 'Silver Aye Aye';
  const fileName = 'webapp.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
};
export const getTotalsAndClientData = () => {
  const sheetValues = getClientSheetValues();
  console.log('sheetValues', sheetValues);
  return sheetValues;
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

// export const onOpen = () => {
//   const menu = SpreadsheetApp.getUi()
//     .createMenu('My Sample React Project') // edit me!
//     .addItem('Sheet Editor', 'openDialog')
//     .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
//     .addItem('About me', 'openAboutSidebar');

//   menu.addToUi();
// };

// export const openAboutSidebar = () => {
//   const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
//   SpreadsheetApp.getUi().showSidebar(html);
// };
