import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';

// Expose public functions by attaching to `global`
global.doGet = publicUiFunctions.doGet;
global.getTotalsAndClientData = () => {
  const clientData = publicSheetFunctions.getClientData().slice(1);
  const totals = {
    totalPaid: 12340,
    numClientsServed: 15,
    ASAP: {
      reimbursementsOwed: 1230,
      daysOwed: 67,
    },
    ALERT: {
      reimbursementsOwed: 230,
      daysOwed: 23,
    },
  };
  return JSON.stringify({
    clientData,
    totals,
  });
};
// global.getTotalsAndClientData = publicUiFunctions.getTotalsAndClientData;

// global.onOpen = publicUiFunctions.onOpen;
// global.openDialog = publicUiFunctions.openDialog;
// global.openDialogBootstrap = publicUiFunctions.openDialogBootstrap;
// global.openAboutSidebar = publicUiFunctions.openAboutSidebar;
global.onEdit = publicSheetFunctions.onEdit;
global.getSheetsData = publicSheetFunctions.getSheetsData;
global.getSheetValues = publicSheetFunctions.getSheetValues;
global.addSheet = publicSheetFunctions.addSheet;
global.deleteSheet = publicSheetFunctions.deleteSheet;
global.setActiveSheet = publicSheetFunctions.setActiveSheet;
