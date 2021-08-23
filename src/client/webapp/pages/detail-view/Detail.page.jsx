import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { CLIENT_NAME_INDEX_ON_CLIENT_SHEET } from '@shared/sheetconfig';
import ClientOverviewData from './ClientOverviewData.component';
import ClientFinancialData from './ClientFinancialData.component';

class DetailPage extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.setModal(false)}
        dialogClassName="modal-90w"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {this.props.clientData[CLIENT_NAME_INDEX_ON_CLIENT_SHEET]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientOverviewData
            clientData={this.props.clientData}
          ></ClientOverviewData>
          <ClientFinancialData
            clientData={this.props.clientData}
          ></ClientFinancialData>
        </Modal.Body>
      </Modal>
    );
  }
}

DetailPage.propTypes = {
  show: PropTypes.bool.isRequired,
  clientData: PropTypes.array.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default DetailPage;
