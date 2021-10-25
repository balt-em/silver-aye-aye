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
import EditableDateCell from './table/EditableDateCell.component';
import EditableTextCell from './table/EditableTextCell.component';

class PaymentRecordTable extends React.Component {
  static contextType = DataLayerContext;

  render() {
    const headers = this.context.clientSheetHeaders;
    const newHeaders = [
      headers[CLIENT_ID_INDEX_ON_CLIENT_SHEET],
      headers[CLIENT_NAME_INDEX_ON_CLIENT_SHEET],
      headers[NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET],
      headers[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET],
      headers[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET],
      { accessor: 'startDate', Header: 'Start Date', Cell: EditableDateCell },
      { accessor: 'endDate', Header: 'End Date', Cell: EditableDateCell },
      {
        accessor: 'terminationDate',
        Header: 'Termination Date',
        Cell: EditableDateCell,
      },
      {
        accessor: 'notes',
        Header: 'Notes',
        Cell: EditableTextCell,
      },
      { accessor: 'paid', Header: 'Amount Paid' },
      { accessor: 'reimbursementUsed', Header: 'Reimbursement Used' },
    ];

    const { clientSheetData, updateData } = this.props;

    return (
      <ReactTable
        columns={newHeaders}
        data={clientSheetData}
        updateData={updateData}
        maxDisplay={100}
      />
    );
  }
}

PaymentRecordTable.propTypes = {
  columns: PropTypes.array,
  clientSheetData: PropTypes.array,
  updateData: PropTypes.func,
};

export default PaymentRecordTable;
