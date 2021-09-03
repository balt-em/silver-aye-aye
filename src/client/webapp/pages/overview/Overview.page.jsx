import React from 'react';
// import { Navbar, Container, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import OverviewCard from './OverviewCard.component';
import CompanyOverviewCard from './CompanyOverviewCard.componet';

class OverviewPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Overview Page</h1>
          <div className="row">
            <div className="col">
              <OverviewCard
                totalPaid={this.props.totals.totalPaid}
                numClientsServed={this.props.totals.numClientsServed}
              ></OverviewCard>
              {/* <input type="text" class="form-control" placeholder="First name" aria-label="First name"> */}
            </div>
            <div className="col">
              <CompanyOverviewCard
                companyData={this.props.totals.ASAP}
                companyName={'ASAP'}
              ></CompanyOverviewCard>
            </div>
            <div className="col">
              <CompanyOverviewCard
                companyData={this.props.totals.ALERT}
                companyName={'Alert'}
              ></CompanyOverviewCard>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OverviewPage.propTypes = {
  totals: PropTypes.object,
};

export default OverviewPage;
