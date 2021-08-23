import React from 'react';
import PropTypes from 'prop-types';
import SaaTable from '../../components/Table.saa.component';
import DetailPage from '../detail-view/Detail.page';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { curClient: undefined, showModal: false };
    this.clickedClient = this.clickedClient.bind(this);
    this.setModal = this.setModal.bind(this);
  }

  clickedClient(index) {
    this.setState(() => ({
      curClient: this.props.clientData[index + 1],
      showModal: true,
    }));
  }

  setModal(showModal) {
    this.setState(() => ({ showModal }));
  }

  render() {
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
        <button onClick={() => this.props.updateClientData('dat')}>
          Update Data
        </button>
        <SaaTable
          editable={false}
          data={this.props.clientData}
          clickedRow={this.clickedClient}
        ></SaaTable>
      </div>
    );
  }
}

SearchPage.propTypes = {
  updateClientData: PropTypes.func.isRequired,
  clientData: PropTypes.array.isRequired,
};

export default SearchPage;
