import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  CLIENT_NAME_INDEX_ON_CLIENT_SHEET,
  NOTES_INDEX_ON_CLIENT_SHEET,
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import ClientOverviewData from './ClientOverviewData.component';
import MiscellaneousClientData from './MiscellaneousClientData.component';
import ClientPaymentOverview from './ClientPaymentOverview.component';
import ClientPaymentBreakdown from './ClientPaymentBreakdown.component';

class DetailPage extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.setModal(false)}
        dialogClassName="detail-modal"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {this.props.clientData[CLIENT_NAME_INDEX_ON_CLIENT_SHEET]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <ClientOverviewData
                clientData={this.props.clientData}
              ></ClientOverviewData>
            </div>
            <div className="col-6">
              <ClientPaymentOverview
                clientData={this.props.clientData}
              ></ClientPaymentOverview>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <MiscellaneousClientData
                clientData={this.props.clientData}
              ></MiscellaneousClientData>
            </div>
            <div className="col-3">
              <h3>Notes</h3>
              <p>{this.props.clientData[NOTES_INDEX_ON_CLIENT_SHEET]}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <ClientPaymentBreakdown
                clientId={
                  this.props.clientData[CLIENT_ID_INDEX_ON_CLIENT_SHEET]
                }
              ></ClientPaymentBreakdown>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

DetailPage.propTypes = {
  show: PropTypes.bool.isRequired,
  clientData: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default DetailPage;
