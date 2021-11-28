import {
  INTAKE_FORM_SHEET_INDEX,
  CLIENT_SHEET_INDEX,
  SUBMITTED_ON_INDEX_ON_INTAKE_SHEET,
} from '@shared/sheetconfig';

import { v4 as uuidv4 } from 'uuid';
import { getSheet } from './sheets';

export function addTrigger() {
  // Trigger every 6 hours.
  ScriptApp.newTrigger('processNewClients')
    .timeBased()
    .everyHours(2)
    .create();
}

export function deleteTrigger() {
  // Loop over all triggers.
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i += 1) {
    console.log('deleting trigger', allTriggers[i]);
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}

// IMPORTANT: If you change the intake form values this may also need to change this, as it relies on ordering
const formatIndividualClientData = clientData => {
  console.log('clientData', clientData);
  const submittedOn = clientData[SUBMITTED_ON_INDEX_ON_INTAKE_SHEET];
  const uuid = uuidv4();
  const clientName = clientData[clientData.length - 1];
  // eslint-disable-next-line no-unused-vars
  const [_1, _, ...remainingIntakeData] = clientData;
  return [
    uuid,
    submittedOn,
    clientName,
    ...Array(7), // leave blank space for calculated columns and termination date
    ...remainingIntakeData.slice(0, -1), // remove name on the end
  ];
};

export const setLastProcessedBackOne = () => {
  const intakeSheet = getSheet(INTAKE_FORM_SHEET_INDEX, false);
  const developerMetadata = intakeSheet.getDeveloperMetadata();

  const lastProcessedRowMetadata = developerMetadata.find(metadata => {
    return metadata.getKey() === 'lastProcessedRow';
  });
  const lastProcessedRow = lastProcessedRowMetadata.getValue();

  lastProcessedRowMetadata.setValue(lastProcessedRow - 1);

  console.log('lastProcessedRow set to ', lastProcessedRow - 1);
};

export const processNewClients = () => {
  // get sheet
  const intakeSheet = getSheet(INTAKE_FORM_SHEET_INDEX, false);
  const developerMetadata = intakeSheet.getDeveloperMetadata();
  console.log('developerMetadata.length', developerMetadata.length);
  const lastProcessedRowMetadata = developerMetadata.find(metadata => {
    return metadata.getKey() === 'lastProcessedRow';
  });

  const lastProcessedRow = parseInt(lastProcessedRowMetadata.getValue(), 10);
  console.log('lastProcessedRow', lastProcessedRow);

  const lastRow = intakeSheet.getLastRow();
  const lastColumn = intakeSheet.getLastColumn();

  if (lastRow > lastProcessedRow) {
    const newRows = intakeSheet
      .getRange(lastProcessedRow + 1, 1, lastRow - lastProcessedRow, lastColumn)
      .getValues();

    const clientSheet = getSheet(CLIENT_SHEET_INDEX, false);

    newRows.forEach(row => {
      const formattedClientData = formatIndividualClientData(row);
      clientSheet.appendRow(formattedClientData);
      console.log('added new client', formattedClientData);
    });

    lastProcessedRowMetadata.setValue(lastRow);

    console.log('processed', lastRow - lastProcessedRow, 'new clients');
  }
};
