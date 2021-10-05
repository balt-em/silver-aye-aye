/* eslint-disable import/first */
import getRandomValues from 'polyfill-crypto.getrandomvalues';

global.crypto = {
  getRandomValues,
};

import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';
import * as publicMigrationFunctions from './data-migration';

// Expose public functions by attaching to `global`
global.doGet = publicUiFunctions.doGet;
global.getClientPaymentData = publicUiFunctions.getClientPaymentData;
global.getTotalsAndClientData = publicUiFunctions.getTotalsAndClientData;
global.addPaymentRecord = publicUiFunctions.addPaymentRecord;
global.updateClientData = publicUiFunctions.updateClientData;

global.onOpen = publicMigrationFunctions.onOpen;
global.migrateData = publicMigrationFunctions.migrateData;

global.onEdit = publicSheetFunctions.onEdit;
global.getSheetsData = publicSheetFunctions.getSheetsData;
