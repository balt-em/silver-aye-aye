import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import SaaTable from '../../components/Table.saa.component';
import SpecificClientData from './SpecificClientData.component';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { curClient: undefined, showModal: false };
  }

  clickedClient(clientData) {
    this.setState(() => ({ curClient: clientData, showModal: true }));
  }

  setModal(showModal) {
    this.setState(() => ({ showModal }));
  }

  render() {
    const curClientData = this.state.curClient;

    return (
      <div>
        <h1>Search Page</h1>
        {/* <p>{this.props.data}</p> */}
        <Button
          variant="primary"
          onClick={() => this.clickedClient(this.props.clientData[0])}
        >
          Custom Width Modal
        </Button>
        {this.state.showModal ? (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setModal(false)}
            // dialogClassName="modal-90w"
            size="lg"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                curClientData: {JSON.stringify(curClientData)}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {/* Create a React component with some kinda of reasonable name that */}
                {/* shows most important overview data about a clientData Put that */}
                {/* component right below this paragraph. You can and should access */}
                {/* and pass the data from 'curClientData'. */}
              </p>{' '}
              <SpecificClientData></SpecificClientData>
            </Modal.Body>
          </Modal>
        ) : (
          ''
        )}
        <button onClick={() => this.props.updateClientData('dat')}>
          Update Data
        </button>
        <SaaTable editable={false} data={this.props.clientData}></SaaTable>
      </div>
    );
  }
}

SearchPage.propTypes = {
  updateClientData: PropTypes.func.isRequired,
  clientData: PropTypes.array.isRequired,
};

export default SearchPage;
