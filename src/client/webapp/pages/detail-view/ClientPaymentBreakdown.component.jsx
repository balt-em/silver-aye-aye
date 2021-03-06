import React from 'react';
import PropTypes from 'prop-types';
import DataLayer, { DataLayerContext } from '@utils/DataLayer.component';
import * as indexes from '@shared/sheetconfig';
import SaaTable from '../../components/Table.saa.component';

class ClientPaymentBreakdown extends React.Component {
  static contextType = DataLayerContext;

  static header = [
    'Start Date',
    'End Date',
    'Reimbursement or Payment',
    'Notes',
  ];

  render() {
    const paymentData = this.context.getClientPaymentData(this.props.clientId);
    if (!paymentData) {
      return (
        <div>
          <h3>No Payments For Client</h3>
        </div>
      );
    }
    const formattedPaymentData = paymentData.map(row => {
      const reimbursement = row[indexes.REIMBURSEMENT_INDEX_ON_PAYMENT_SHEET]; // 'y' or 'n'
      const legibleReimbursement =
        reimbursement === 'y' ? 'Reimbursement' : 'Payment';
      return [
        DataLayer.getReadableDate(
          row[indexes.START_DATE_INDEX_ON_PAYMENT_SHEET]
        ),
        DataLayer.getReadableDate(row[indexes.END_DATE_INDEX_ON_PAYMENT_SHEET]),
        legibleReimbursement,
        row[indexes.NOTES_INDEX_ON_PAYMENT_SHEET],
      ];
    });
    return (
      <div>
        <h3>Client Payment Breakdown</h3>
        <SaaTable
          header={ClientPaymentBreakdown.header}
          data={formattedPaymentData}
        ></SaaTable>
      </div>
    );
  }
}

ClientPaymentBreakdown.propTypes = {
  clientId: PropTypes.string.isRequired,
};
export default ClientPaymentBreakdown;
