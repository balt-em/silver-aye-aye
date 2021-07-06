import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';

const doGet = () => {
  const title = 'BALT Starter';
  const fileName = 'dialog-demo-bootstrap.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
};

// Expose public functions by attaching to `global`
global.doGet = doGet;
global.onEdit = publicSheetFunctions.onEdit;
global.onOpen = publicUiFunctions.onOpen;
global.openDialog = publicUiFunctions.openDialog;
global.openDialogBootstrap = publicUiFunctions.openDialogBootstrap;
global.openAboutSidebar = publicUiFunctions.openAboutSidebar;
global.getSheetsData = publicSheetFunctions.getSheetsData;
global.getSheetValues = publicSheetFunctions.getSheetValues;
global.addSheet = publicSheetFunctions.addSheet;
global.deleteSheet = publicSheetFunctions.deleteSheet;
global.setActiveSheet = publicSheetFunctions.setActiveSheet;
