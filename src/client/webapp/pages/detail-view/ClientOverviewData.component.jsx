import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import { DataLayerContext } from '@utils/DataLayer.component';
import VerticalReactTable from '../../components/table/VerticalReactTable.component';

class ClientOverviewData extends React.Component {
  static contextType = DataLayerContext;

  constructor(props) {
    super(props);
    this.state = {
      clientData: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    this.setState({ clientData: { ...this.props.clientData } });
  }

  onChange(_, id, val) {
    const newData = { ...this.state.clientData, [id]: val };
    this.setState({ clientData: newData });
  }

  onSave() {
    this.context.updateClientData(this.state.clientData);
  }

  render() {
    const headers = this.context.clientSheetHeaders;
    const newHeaders = [
      headers[indexes.CLIENT_NAME_INDEX_ON_CLIENT_SHEET],
      headers[indexes.CASE_NUMBER_INDEX_ON_CLIENT_SHEET],
      headers[indexes.EMAIL_INDEX_ON_CLIENT_SHEET],
      headers[indexes.BEST_WAY_TO_CONTACT_CLIENT_INDEX_ON_CLIENT_SHEET],
      headers[indexes.CLIENTS_PHONE_NUMBER_INDEX_ON_CLIENT_SHEET],
      headers[indexes.CLIENT_HOOK_UP_DATE_INDEX_ON_CLIENT_SHEET],
      headers[
        indexes
          .INFO_FOR_SOMEONE_FILLING_OUT_ON_BEHALF_OF_CLIENT_INDEX_ON_CLIENT_SHEET
      ],
      headers[indexes.CLIENTS_NEXT_COURT_DATE_INDEX_ON_CLIENT_SHEET],
      headers[indexes.RESCHEULED_COURT_DATE_INDEX_ON_CLIENT_SHEET],
    ];

    return (
      <div>
        <h3>Client Overview</h3>
        <VerticalReactTable
          data={[this.state.clientData]}
          columns={newHeaders}
          editable={true}
          onChange={this.onChange}
          onSave={this.onSave}
        />
      </div>
    );
  }
}

ClientOverviewData.propTypes = {
  clientData: PropTypes.object.isRequired,
};
export default ClientOverviewData;
