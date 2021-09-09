import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';
import * as publicMigrationFunctions from './data-migration';

// Expose public functions by attaching to `global`
global.doGet = publicUiFunctions.doGet;
global.getClientPaymentData = publicUiFunctions.getClientPaymentData;
global.getTotalsAndClientData = () => {
  const clientData = publicSheetFunctions.getClientData();
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

global.onOpen = publicMigrationFunctions.onOpen;
global.migrateData = publicMigrationFunctions.migrateData;

global.onEdit = publicSheetFunctions.onEdit;
global.getSheetsData = publicSheetFunctions.getSheetsData;
