import React from 'react';
import { DataLayerContext } from '@utils/DataLayer.component';
import {
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
  CLIENT_NAME_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import PropTypes from 'prop-types';
import ReactTable from './table/ReactTable.component';
import EditableCell from './table/EditableCell.component';

class PaymentRecordTable extends React.Component {
  static contextType = DataLayerContext;

  constructor(props) {
    super(props);
    this.state = { clientSheetData: [] };
    this.updateMyData = this.updateMyData.bind(this);
  }

  // TODO: REMOVE or rework
  static formatClientData(clientData) {
    console.log('clientData', clientData);
    return clientData;
  }

  // eslint-disable-next-line class-methods-use-this
  updateMyData(rowIndex, columnId, value) {
    console.log('updateMyData', rowIndex, columnId, value);
    // We also turn on the flag to not reset the page
    // setSkipPageReset(true);
    // setData(old =>
    //   old.map((row, index) => {
    //     if (index === rowIndex) {
    //       return {
    //         ...old[rowIndex],
    //         [columnId]: value,
    //       };
    //     }
    //     return row;
    //   })
    // );
  }

  componentDidMount() {
    const data = PaymentRecordTable.formatClientData(
      this.props.clientSheetData
    );
    this.setState({
      clients: data,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.clientSheetData.length !== prevProps.clientSheetData.length)
      this.setState({
        clientSheetData: this.props.clientSheetData,
      });
  }

  render() {
    const headers = this.context.clientSheetHeaders;
    const newHeaders = [
      headers[CLIENT_ID_INDEX_ON_CLIENT_SHEET],
      headers[CLIENT_NAME_INDEX_ON_CLIENT_SHEET],
      headers[NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET],
      headers[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET],
      headers[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET],
      { accessor: 'startDate', Header: 'Start Date', Cell: EditableCell },
      { accessor: 'endDate', Header: 'End Date', Cell: EditableCell },
      {
        accessor: 'terminationDate',
        Header: 'Termination Date',
        Cell: EditableCell,
      },
    ];

    // { accessor: `${index}`, Header: header, Cell: EditableCell, }
    // { index: value }

    const { clientSheetData } = this.state;

    return (
      <ReactTable
        columns={newHeaders}
        data={clientSheetData}
        // clickedRow={this.props.removeClient}
        maxDisplay={100}
      />
    );
  }
}

PaymentRecordTable.propTypes = {
  removeClient: PropTypes.func,
  columns: PropTypes.array,
  clientSheetData: PropTypes.array,
};

export default PaymentRecordTable;
