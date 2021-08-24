import React from 'react';
import PropTypes from 'prop-types';
import { DataLayerContext } from '@utils/DataLayer.component';
import SaaTable from '../../components/Table.saa.component';

class ClientPaymentBreakdown extends React.Component {
  static contextType = DataLayerContext;

  render() {
    const paymentData = this.context.getClientPaymentData(this.props.clientId);
    console.log(paymentData);
    return (
      <div>
        <h3>Client Payment Overview</h3>
        {/* {JSON.stringify(paymentData)} */}
        <SaaTable data={paymentData}></SaaTable>
      </div>
    );
  }
}

ClientPaymentBreakdown.propTypes = {
  clientId: PropTypes.number.isRequired,
};
export default ClientPaymentBreakdown;
