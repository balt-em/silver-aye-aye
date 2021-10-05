import React from 'react';
import PropTypes from 'prop-types';
import * as indexes from '@shared/sheetconfig';
import { DataLayerContext } from '@utils/DataLayer.component';
import VerticalReactTable from '../../components/table/VerticalReactTable.component';

class MiscellaneousClientData extends React.Component {
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
      headers[indexes.TERMINATION_DATE_INDEX_ON_CLIENT_SHEET],
      headers[indexes.HOME_DETENTION_COMPANY_INDEX_ON_CLIENT_SHEET],
      headers[indexes.CONFIRMED_PICKUP_INDEX_ON_CLIENT_SHEET],
      headers[indexes.CLIENTS_DATE_OF_BIRTH_INDEX_ON_CLIENT_SHEET],
      headers[indexes.ATTORNEYS_NAME_INDEX_ON_CLIENT_SHEET],
      headers[
        indexes
          .IS_REPRESENTATION_FROM_PUBLIC_DEFENDERS_OFFICE_INDEX_ON_CLIENT_SHEET
      ],
      headers[indexes.KNOWN_DRUG_ISSUES_INDEX_ON_CLIENT_SHEET],
      headers[indexes.HEALTH_ISSUES_INDEX_ON_CLIENT_SHEET],
      headers[indexes.IMPORTANT_CLIENT_DETAILS_INDEX_ON_CLIENT_SHEET],
    ];

    return (
      <div>
        <h3>Miscellaneous Client Data</h3>
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

MiscellaneousClientData.propTypes = {
  clientData: PropTypes.object.isRequired,
};
export default MiscellaneousClientData;
