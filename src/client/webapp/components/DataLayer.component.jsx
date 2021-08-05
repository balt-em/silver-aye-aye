import React from 'react';
import PropTypes from 'prop-types';
import server from '../../utils/server';

const { serverFunctions } = server;

class DataLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clientData: [], totals: {} };
    this.updateClientData = this.updateClientData.bind(this);
  }

  static undefinedProps = {
    clientData: [],
    totals: {},
    updateClientData: () => {
      console.error('updateClientData not assigned');
    },
  };

  componentDidMount() {
    serverFunctions
      .getTotalsAndClientData()
      .then(data => {
        const dat = JSON.parse(data);
        this.setState(() => ({
          clientData: dat.clientData,
          totals: dat.totals,
        }));
      })
      .catch(alert);
  }

  // eslint-disable-next-line class-methods-use-this
  updateClientData(data) {
    console.log('called updateData callback', data);
    // this.setState({ data });
  }

  render() {
    return React.cloneElement(this.props.element, {
      totals: this.state.totals,
      clientData: this.state.clientData,
      updateClientData: this.updateClientData,
    });
  }
}

DataLayer.propTypes = {
  element: PropTypes.element.isRequired,
};

export default DataLayer;
