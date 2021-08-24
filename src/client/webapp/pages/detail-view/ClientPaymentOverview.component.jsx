import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';
import DataLayer from '../../utils/DataLayer.component';

class ClientPaymentOverview extends React.Component {
  render() {
    const { clientData } = this.props;

    const formattedClientData = [
      [
        'Payment Pickup Date',
        DataLayer.getReadableDate(
          clientData[indexes.PAYMENT_PICKUP_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      ['Total Paid', clientData[indexes.TOTAL_PAID_INDEX_ON_CLIENT_SHEET]],
      [
        'Days Owed',
        clientData[indexes.NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Date Paid Through',
        DataLayer.getReadableDate(
          clientData[indexes.PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [
        'Reimbursement Owed',
        clientData[indexes.REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Reimbursement Used',
        clientData[indexes.REIMBURSEMENT_USED_INDEX_ON_CLIENT_SHEET],
      ],
      [
        'Termination Date',
        DataLayer.getReadableDate(
          clientData[indexes.TERMINATION_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
    ];
    return (
      <div>
        <h3>Client Payment Overview</h3>
        <SaaTable data={formattedClientData}></SaaTable>
      </div>
    );
  }
}

ClientPaymentOverview.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default ClientPaymentOverview;
