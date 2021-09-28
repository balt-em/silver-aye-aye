import React from 'react';
import PropTypes from 'prop-types';
import {
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET,
  CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET,
  CLIENTS_DATE_OF_BIRTH_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
  SUBMITTED_ON_INDEX_ON_CLIENT_SHEET,
  RESCHEULED_COURT_DATE_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import server from './server';

const { serverFunctions } = server;

export const DataLayerContext = React.createContext({
  getClientPaymentData: () => 'not implemented',
  updateClientData: () => 'not implemented',
  addPaymentRecord: () => 'not implemented',
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
    this.addPaymentRecord = this.addPaymentRecord.bind(this);
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
        const dateFields = [
          RESCHEULED_COURT_DATE_INDEX_ON_CLIENT_SHEET,
          CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET,
          CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET,
          CLIENTS_DATE_OF_BIRTH_INDEX_ON_CLIENT_SHEET,
          TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
          PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
          SUBMITTED_ON_INDEX_ON_CLIENT_SHEET,
        ];
        const clientSheetData = rows.map(row => {
          const rowMap = {};
          row.forEach((field, index) => {
            if (dateFields.includes(index) && field) {
              rowMap[index] = new Date(field);
            } else if (dateFields.includes(index)) {
              rowMap[index] = undefined;
            } else {
              rowMap[index] = field;
            }
          });
          rowMap.id = row[CLIENT_ID_INDEX_ON_CLIENT_SHEET];
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

  // https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
  // the difference between two dates including the start OR the end date: 1/1 - 1/1 is 0 days
  static getDateDifExclusive(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = date1;
    const secondDate = date2;

    return Math.floor(Math.abs((firstDate - secondDate) / oneDay));
  }

  // eslint-disable-next-line class-methods-use-this
  addPaymentRecord(data, rate, companyName, initials, datePaid) {
    console.log('paymentData', data);
    console.log('paymentData', rate, companyName, initials, datePaid);
    serverFunctions.addPaymentRecord(
      JSON.stringify({
        paymentBreakdownData: data,
        rate,
        companyName,
        initials,
        datePaid,
      })
    );
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
      addPaymentRecord: this.addPaymentRecord,
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
