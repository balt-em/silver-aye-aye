import React from 'react';

import { DataLayerContext } from '@utils/DataLayer.component';
import * as indexes from '@shared/sheetconfig';
import DetailPage from '../detail-view/Detail.page';
import ReactTable from '../../components/table/ReactTable.component';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { curClient: undefined, showModal: false };
    this.clickedClient = this.clickedClient.bind(this);
    this.setModal = this.setModal.bind(this);
  }

  static contextType = DataLayerContext;

  clickedClient(index) {
    const client = this.context.clientSheetData[index];
    this.setState(() => ({
      curClient: client, // don't include header
      showModal: true,
    }));
  }

  setModal(showModal) {
    this.setState(() => ({ showModal }));
  }

  render() {
    const { clientSheetData, clientSheetHeaders } = this.context;
    return (
      <div>
        <h1>Search</h1>
        {this.state.showModal ? (
          <DetailPage
            show={this.state.showModal}
            clientData={this.state.curClient}
            setModal={this.setModal}
          ></DetailPage>
        ) : (
          undefined
        )}

        <ReactTable
          columns={clientSheetHeaders}
          data={clientSheetData}
          clickedRow={this.clickedClient}
          maxDisplay={100}
        />
      </div>
    );
  }
}

export default SearchPage;
