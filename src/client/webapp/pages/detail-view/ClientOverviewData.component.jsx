import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';

class ClientOverviewData extends React.Component {
  render() {
    const { clientData } = this.props;
    const formattedClientData = [
      ['Client Name', clientData[indexes.CLIENT_NAME_INDEX_ON_CLIENT_SHEET]],
      ['Client Id', clientData[indexes.CLIENT_ID_INDEX_ON_CLIENT_SHEET]],
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
        clientData[indexes.CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Next Court Date',
        clientData[indexes.CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET]
          ? clientData[indexes.CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET]
          : 'N/A',
      ],
    ];
    return (
      <div>
        <h2>Client Overview</h2>
        <SaaTable data={formattedClientData}></SaaTable>
      </div>
    );
  }
}

ClientOverviewData.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default ClientOverviewData;
