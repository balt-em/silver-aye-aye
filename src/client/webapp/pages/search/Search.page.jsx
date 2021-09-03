import React from 'react';
import PropTypes from 'prop-types';

import { DataLayerContext } from '@utils/DataLayer.component';
import DetailPage from '../detail-view/Detail.page';
import ReactTable from '../../components/ReactTable.component';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { curClient: undefined, showModal: false };
    this.clickedClient = this.clickedClient.bind(this);
    this.setModal = this.setModal.bind(this);
  }

  static contextType = DataLayerContext;

  clickedClient(index) {
    this.setState(() => ({
      curClient: this.props.clientData[index + 1], // don't include header
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
        <h1>Search Page</h1>
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
        />
      </div>
    );
  }
}

SearchPage.propTypes = {
  updateClientData: PropTypes.func.isRequired,
  clientData: PropTypes.array.isRequired,
};

export default SearchPage;
