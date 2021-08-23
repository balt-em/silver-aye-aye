import { getClientSheetValues } from './sheets';

// eslint-disable-next-line import/prefer-default-export
export const doGet = () => {
  const title = 'Silver Aye Aye';
  const fileName = 'webapp.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
};
export const getTotalsAndClientData = () => {
  console.log('getTotalsAndClientData');

  const sheetValues = getClientSheetValues();
  console.log('sheetValues', sheetValues);
  return sheetValues;
};

// export const onOpen = () => {
//   const menu = SpreadsheetApp.getUi()
//     .createMenu('My Sample React Project') // edit me!
//     .addItem('Sheet Editor', 'openDialog')
//     .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
//     .addItem('About me', 'openAboutSidebar');

//   menu.addToUi();
// };

// export const openDialog = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-demo')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor');
// };

// export const openDialogBootstrap = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-demo-bootstrap')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
// };

// export const openAboutSidebar = () => {
//   const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
//   SpreadsheetApp.getUi().showSidebar(html);
// };
