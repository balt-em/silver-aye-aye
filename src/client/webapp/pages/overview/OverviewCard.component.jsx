import React from 'react';
import PropTypes from 'prop-types';

class OverviewCard extends React.Component {
  render() {
    const totalAmountPaid = this.props.totalPaid;
    const numberClientsServed = this.props.numClientsServed;

    return (
      <div className="card">
        <div className="card-header">Overview Data</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Total Paid: {totalAmountPaid}</li>
          <li className="list-group-item">
            Number Clients Served: {numberClientsServed}
          </li>
        </ul>
      </div>
    );
  }
}

OverviewCard.propTypes = {
  totalPaid: PropTypes.number.isRequired,
  numClientsServed: PropTypes.number.isRequired,
};

export default OverviewCard;
