import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import DataLayer from '@utils/DataLayer.component';
import SaaTable from '../../components/Table.saa.component';

class ClientOverviewData extends React.Component {
  render() {
    const { clientData } = this.props;

    const formattedClientData = [
      ['Client Name', clientData[indexes.CLIENT_NAME_INDEX_ON_CLIENT_SHEET]],
      ['Case Number', clientData[indexes.CASE_NUMBER_INDEX_ON_CLIENT_SHEET]],
      ['Email', clientData[indexes.EMAIL_INDEX_ON_CLIENT_SHEET]],
      [
        'Best Way to Contact',
        clientData[indexes.BEST_WAY_TO_CONTACT_CLIENT_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Phone Number',
        clientData[indexes.CLIENTS_PHONE_NUMBER_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Hookup Date',
        DataLayer.getReadableDate(
          clientData[indexes.CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        "Info for Anyone Filling Out on Another's Behalf",
        clientData[
          indexes
            .INFO_FOR_SOMEONE_FILLING_OUT_ON_BEHALF_OF_CLIENT_INDEX_ON_CLIENT_SHEET
        ],
      ],
      [
        'Next Court Date',
        DataLayer.getReadableDate(
          clientData[indexes.CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        'Rescheduled Court Date',
        DataLayer.getReadableDate(
          clientData[indexes.RESCHEULED_COURT_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
    ];
    return (
      <div>
        <h3>Client Overview</h3>
        <SaaTable data={formattedClientData}></SaaTable>
      </div>
    );
  }
}

ClientOverviewData.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default ClientOverviewData;
