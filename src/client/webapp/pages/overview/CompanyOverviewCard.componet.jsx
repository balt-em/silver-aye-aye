import React from 'react';
import PropTypes from 'prop-types';

class CompanyOverviewCard extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="card-header">{this.props.companyName} Company Data</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Reimbursements Owed: {this.props.companyData.reimbursementsOwed}
          </li>
          <li className="list-group-item">
            Days Owed: {this.props.companyData.daysOwed}
          </li>
        </ul>
      </div>
    );
  }
}

CompanyOverviewCard.propTypes = {
  companyData: PropTypes.object.isRequired,
  companyName: PropTypes.string.isRequired,
};
export default CompanyOverviewCard;
