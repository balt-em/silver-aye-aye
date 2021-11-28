/* eslint-disable import/first */
import getRandomValues from 'polyfill-crypto.getrandomvalues';

global.crypto = {
  getRandomValues,
};

import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';
import * as publicMigrationFunctions from './data-migration';
import * as transferIntakeDataFunctions from './transfer-intake-data';

// Expose public functions by attaching to `global`
global.doGet = publicUiFunctions.doGet;
global.getClientPaymentData = publicUiFunctions.getClientPaymentData;
global.getTotalsAndClientData = publicUiFunctions.getTotalsAndClientData;
global.addPaymentRecord = publicUiFunctions.addPaymentRecord;
global.updateClientData = publicUiFunctions.updateClientData;
global.removeDuplicate = publicUiFunctions.removeDuplicate;

global.onOpen = publicMigrationFunctions.onOpen;
global.migrateData = publicMigrationFunctions.migrateData;

global.onEdit = publicSheetFunctions.onEdit;
global.getSheetsData = publicSheetFunctions.getSheetsData;

global.processNewClients = transferIntakeDataFunctions.processNewClients;
global.setLastProcessedBackOne =
  transferIntakeDataFunctions.setLastProcessedBackOne;
global.deleteTrigger = transferIntakeDataFunctions.deleteTrigger;
global.addTrigger = transferIntakeDataFunctions.addTrigger;
