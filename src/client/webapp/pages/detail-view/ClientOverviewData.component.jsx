import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import DataLayer from '@utils/DataLayer.component';
import SaaTable from '../../components/Table.saa.component';

class ClientOverviewData extends React.Component {
  render() {
    const { clientData } = this.props;

    const header = [
      'Client Name',
      'Case Number',
      'Email',
      'Best Way to Contact',
      'Phone Number',
      'Hookup Date',
      "Info for Anyone Filling Out on Another's Behalf",
      'Next Court Date',
      'Rescheduled Court Date',
    ];

    const formattedClientData = [
      [clientData[indexes.CLIENT_NAME_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.CASE_NUMBER_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.EMAIL_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.BEST_WAY_TO_CONTACT_CLIENT_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.CLIENTS_PHONE_NUMBER_INDEX_ON_CLIENT_SHEET]],
      [
        DataLayer.getReadableDate(
          clientData[indexes.CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        clientData[
          indexes
            .INFO_FOR_SOMEONE_FILLING_OUT_ON_BEHALF_OF_CLIENT_INDEX_ON_CLIENT_SHEET
        ],
      ],
      [
        DataLayer.getReadableDate(
          clientData[indexes.CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        DataLayer.getReadableDate(
          clientData[indexes.RESCHEULED_COURT_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
    ];
    return (
      <div>
        <h3>Client Overview</h3>
        <SaaTable
          data={formattedClientData}
          header={header}
          verticalHeader={true}
          editable={true}
        ></SaaTable>
      </div>
    );
  }
}

ClientOverviewData.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default ClientOverviewData;
