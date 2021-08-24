import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';
import DataLayer from '../../utils/DataLayer.component';

class MiscellaneousClientData extends React.Component {
  render() {
    const { clientData } = this.props;

    const formattedClientData = [
      [
        'Home Detention Company',
        clientData[indexes.HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Confirmed Pickup',
        clientData[indexes.CONFIRMED_PICKUP_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Date of Birth',
        DataLayer.getReadableDate(
          clientData[indexes.CLIENTS_DATE_OF_BIRTH_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        "Attorney's Name",
        clientData[indexes.ATTORNEYS_NAME_INDEX_ON_CLIENT_SHEET],
      ],
      [
        "Resprentation from Public Defender's Office?",
        clientData[
          indexes
            .IS_REPRESENTATION_FROM_PUBLIC_DEFENDERS_OFFICE_INDEX_ON_CLIENT_SHEET
        ],
      ],
      [
        'Known Drug Issues',
        clientData[indexes.KNOWN_DRUG_ISSUES_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Health Issues',
        clientData[indexes.HEALTH_ISSUES_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Important Client Details',
        clientData[indexes.IMPORTANT_CLIENT_DETAILS_INDEX_ON_CLIENT_SHEET],
      ],
    ];
    return (
      <div>
        <h3>Miscellaneous Client Data</h3>
        <SaaTable data={formattedClientData}></SaaTable>
      </div>
    );
  }
}

MiscellaneousClientData.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default MiscellaneousClientData;
