import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  CLIENT_NAME_INDEX_ON_CLIENT_SHEET,
  NOTES_INDEX_ON_CLIENT_SHEET,
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import { DataLayerContext } from '@utils/DataLayer.component';
import ClientOverviewData from './ClientOverviewData.component';
import MiscellaneousClientData from './MiscellaneousClientData.component';
import ClientPaymentOverview from './ClientPaymentOverview.component';
import ClientPaymentBreakdown from './ClientPaymentBreakdown.component';
import ConfirmModal from '../../components/ConfirmModal.component';

class DetailPage extends React.Component {
  static contextType = DataLayerContext;

  render() {
    const { clientData } = this.props;

    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.setModal(false)}
        dialogClassName="detail-modal"
        size="lg"
        aria-labelledby="detail-page"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ width: '100%' }} id="detail-page">
            <span>{clientData[CLIENT_NAME_INDEX_ON_CLIENT_SHEET]}</span>
            <ConfirmModal
              modalText={
                'This duplicate will be permanently removed from the client sheet.'
              }
              buttonText={'Mark as Duplicate and Remove'}
              onConfirm={() => {
                this.context.removeDuplicate(
                  clientData[CLIENT_ID_INDEX_ON_CLIENT_SHEET]
                );
              }}
            ></ConfirmModal>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <ClientOverviewData clientData={clientData}></ClientOverviewData>
            </div>
            <div className="col-6">
              <MiscellaneousClientData
                clientData={clientData}
              ></MiscellaneousClientData>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <ClientPaymentOverview
                clientData={clientData}
              ></ClientPaymentOverview>
            </div>
            <div className="col-3">
              <h3>Notes</h3>
              <p>{clientData[NOTES_INDEX_ON_CLIENT_SHEET]}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <ClientPaymentBreakdown
                clientId={clientData[CLIENT_ID_INDEX_ON_CLIENT_SHEET]}
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
