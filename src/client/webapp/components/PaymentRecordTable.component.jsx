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
  }

  // componentDidMount() {
  //   const data = PaymentRecordTable.formatClientData(
  //     this.props.clientSheetData
  //   );
  //   this.setState({
  //     clientSheetData: data,
  //   });
  // }

  // componentDidUpdate(prevProps) {
  //   if (
  //     this.props.clientSheetData.length !== prevProps.clientSheetData.length
  //   ) {
  //     const data = PaymentRecordTable.formatClientData(
  //       this.props.clientSheetData
  //     );
  //     this.setState({
  //       clientSheetData: data,
  //     });
  //   }
  // }

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
