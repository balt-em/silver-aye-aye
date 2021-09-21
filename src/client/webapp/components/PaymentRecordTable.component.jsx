/* eslint-disable no-param-reassign */
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
    this.updateData = this.updateData.bind(this);
  }

  // TODO: REMOVE or rework
  static formatClientData(clientData) {
    clientData.forEach(client => {
      const paidThroughDate = client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET];
      const terminationDate = client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET];

      let startDate;
      if (paidThroughDate) {
        startDate = new Date();
        startDate.setDate(paidThroughDate.getDate() + 1);
      }

      const endDate = terminationDate || new Date();

      client.startDate = startDate;
      client.endDate = startDate > endDate ? undefined : endDate;
      client.terminationDate = terminationDate;
    });
    return clientData;
  }

  updateData = (rowIndex, columnId, value) => {
    const oldRow = this.state.clientSheetData[rowIndex];
    const newRow = { ...oldRow, [columnId]: value };
    const newClientSheetData = [...this.state.clientSheetData];
    newClientSheetData[rowIndex] = newRow;

    this.setState({ clientSheetData: newClientSheetData });
  };

  componentDidMount() {
    const data = PaymentRecordTable.formatClientData(
      this.props.clientSheetData
    );
    this.setState({
      clientSheetData: data,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.clientSheetData.length !== prevProps.clientSheetData.length
    ) {
      const data = PaymentRecordTable.formatClientData(
        this.props.clientSheetData
      );
      this.setState({
        clientSheetData: data,
      });
    }
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
        updateData={this.updateData}
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
