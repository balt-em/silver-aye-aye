import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';
import DataLayer from '../../utils/DataLayer.component';

class ClientPaymentOverview extends React.Component {
  render() {
    const { clientData } = this.props;

    const header = [
      'Payment Pickup Date',
      'Total Paid',
      'Days Owed',
      'Date Paid Through',
      'Reimbursement Owed',
      'Reimbursement Used',
    ];

    const formattedClientData = [
      [
        DataLayer.getReadableDate(
          clientData[indexes.PAYMENT_PICKUP_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [clientData[indexes.TOTAL_PAID_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET]],
      [
        DataLayer.getReadableDate(
          clientData[indexes.PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]
        ),
      ],
      [clientData[indexes.REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET]],
      [clientData[indexes.REIMBURSEMENT_USED_INDEX_ON_CLIENT_SHEET]],
    ];
    return (
      <div>
        <h3>Client Payment Overview</h3>
        <SaaTable
          data={formattedClientData}
          header={header}
          verticalHeader={true}
        ></SaaTable>
      </div>
    );
  }
}

ClientPaymentOverview.propTypes = {
  clientData: PropTypes.object.isRequired,
};
export default ClientPaymentOverview;
