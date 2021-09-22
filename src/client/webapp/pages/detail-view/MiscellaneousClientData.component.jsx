import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';
import DataLayer from '../../utils/DataLayer.component';

class MiscellaneousClientData extends React.Component {
  render() {
    const { clientData } = this.props;

    const header = [
      'Home Detention Company',
      'Confirmed Pickup',
      'Date of Birth',
      "Attorney's Name",
      "Resprentation from Public Defender's Office?",
      'Known Drug Issues',
      'Health Issues',
      'Important Client Details',
    ];

    const formattedClientData = [
      [clientData[indexes.HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.CONFIRMED_PICKUP_INDEX_ON_CLIENT_SHEET]],
      [
        DataLayer.getReadableDate(
          clientData[indexes.CLIENTS_DATE_OF_BIRTH_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [clientData[indexes.ATTORNEYS_NAME_INDEX_ON_CLIENT_SHEET]],
      [
        clientData[
          indexes
            .IS_REPRESENTATION_FROM_PUBLIC_DEFENDERS_OFFICE_INDEX_ON_CLIENT_SHEET
        ],
      ],
      [clientData[indexes.KNOWN_DRUG_ISSUES_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.HEALTH_ISSUES_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.IMPORTANT_CLIENT_DETAILS_INDEX_ON_CLIENT_SHEET]],
    ];
    return (
      <div>
        <h3>Miscellaneous Client Data</h3>
        <SaaTable
          data={formattedClientData}
          editable={true}
          header={header}
          verticalHeader={true}
        ></SaaTable>
      </div>
    );
  }
}

MiscellaneousClientData.propTypes = {
  clientData: PropTypes.object.isRequired,
};
export default MiscellaneousClientData;
