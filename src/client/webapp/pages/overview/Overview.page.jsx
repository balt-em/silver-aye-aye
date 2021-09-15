import React from 'react';
// import { Navbar, Container, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DataLayerContext } from '@utils/DataLayer.component';
import OverviewCard from './OverviewCard.component';
import CompanyOverviewCard from './CompanyOverviewCard.componet';

class OverviewPage extends React.Component {
  static contextType = DataLayerContext;

  render() {
    const { totals } = this.context;

    return (
      <div>
        <div>
          <h1>Overview Page</h1>
          <div className="row">
            <div className="col">
              <OverviewCard
                totalPaid={totals.totalPaid}
                numClientsServed={totals.numClientsServed}
              ></OverviewCard>
              {/* <input type="text" class="form-control" placeholder="First name" aria-label="First name"> */}
            </div>
            <div className="col">
              <CompanyOverviewCard
                companyData={totals.ASAP}
                companyName={'ASAP'}
              ></CompanyOverviewCard>
            </div>
            <div className="col">
              <CompanyOverviewCard
                companyData={totals.ALERT}
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
