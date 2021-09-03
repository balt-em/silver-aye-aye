import React from 'react';
import PropTypes from 'prop-types';
import server from './server';

const { serverFunctions } = server;

export const DataLayerContext = React.createContext({
  getClientPaymentData: () => 'not implemented',
  clientSheetHeaders: [],
  clientSheetData: [],
});

class DataLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: [],
      totals: {},
      loaded: false,
      paymentData: {},
      clientSheetHeaders: [],
      clientSheetData: [],
    };
    this.updateClientData = this.updateClientData.bind(this);
    this.getClientPaymentData = this.getClientPaymentData.bind(this);
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
        const { clientData, totals } = JSON.parse(data);
        const [headers, ...rows] = clientData;
        const clientSheetHeaders = headers.map((header, index) => {
          return { accessor: `${index}`, Header: header };
        });
        const clientSheetData = rows.map(row => {
          const rowMap = {};
          row.forEach((field, index) => {
            rowMap[index] = field;
          });
          return rowMap;
        });

        this.setState(() => ({
          clientSheetData,
          clientSheetHeaders,
          clientData, // shouldn't need to save clientData
          totals,
          loaded: true,
        }));
      })
      .catch(alert);
    serverFunctions
      .getClientPaymentData()
      .then(data => {
        const dat = JSON.parse(data);
        console.log('getClientPaymentData', dat);
        this.setState(() => ({
          paymentData: dat,
        }));
      })
      .catch(alert);
  }

  static getReadableDate(dateString) {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  }

  // eslint-disable-next-line class-methods-use-this
  updateClientData(data) {
    console.log('called updateData callback', data);
    // this.setState({ data });
  }

  getClientPaymentData(clientId) {
    return this.state.paymentData[clientId];
  }

  render() {
    if (!this.state.loaded) {
      return this.props.loadingPage;
    }
    const context = {
      getClientPaymentData: this.getClientPaymentData,
      clientSheetHeaders: this.state.clientSheetHeaders,
      clientSheetData: this.state.clientSheetData,
    };

    return (
      <DataLayerContext.Provider value={context}>
        {React.cloneElement(this.props.element, {
          totals: this.state.totals,
          clientData: this.state.clientData,
          updateClientData: this.updateClientData,
        })}
      </DataLayerContext.Provider>
    );
  }
}

DataLayer.propTypes = {
  element: PropTypes.element.isRequired,
  loadingPage: PropTypes.element.isRequired,
};

export default DataLayer;
