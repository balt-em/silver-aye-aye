import React from 'react';
// import { Navbar, Container, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

class OverviewPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Overview Page</h1>
          <p>
            NYAN NYAN!!! Enter a name for a new sheet, hit enter and the new
            sheet will be created. Click the red{' '}
            <span className="text-danger">&times;</span> next to the sheet name
            to delete it.
          </p>
          <ul>
            {Object.keys(this.props.totals).map(key => {
              return (
                <p key={key}>
                  {key}: {JSON.stringify(this.props.totals[key])}
                </p>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

OverviewPage.propTypes = {
  totals: PropTypes.object.isRequired,
};

export default OverviewPage;
