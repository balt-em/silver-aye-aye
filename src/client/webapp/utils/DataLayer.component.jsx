import React from 'react';
import PropTypes from 'prop-types';
import server from './server';

const { serverFunctions } = server;

export const DataLayerContext = React.createContext({
  getClientPaymentData: () => 'not implemented',
  updateClientData: () => 'not implemented',
  totals: {},
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
  }

  getClientPaymentData(clientId) {
    return this.state.paymentData[clientId];
  }

  render() {
    if (!this.state.loaded) {
      return this.props.loadingPage;
    }
    const context = {
      clientSheetHeaders: this.state.clientSheetHeaders,
      clientSheetData: this.state.clientSheetData,
      totals: this.state.totals,
      getClientPaymentData: this.getClientPaymentData,
      updateClientData: this.updateClientData,
    };

    return (
      <DataLayerContext.Provider value={context}>
        {this.props.element}
      </DataLayerContext.Provider>
    );
  }
}

DataLayer.propTypes = {
  element: PropTypes.element.isRequired,
  loadingPage: PropTypes.element.isRequired,
};

export default DataLayer;
