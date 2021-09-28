/* eslint-disable no-param-reassign */
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Card, Form, Col } from 'react-bootstrap';
import { getDate } from '@shared/utils';

import DataLayer, { DataLayerContext } from '@utils/DataLayer.component';
import {
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
  CLIENT_NAME_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import ReactTable from '../../components/table/ReactTable.component';
import CollapsableCard from '../../components/CollapsableCard.component';
import PaymentRecordTable from '../../components/PaymentRecordTable.component';

class PaymentPage extends React.Component {
  static contextType = DataLayerContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedClients: [],
      clients: [],
      rate: 12,
      datePaid: getDate(),
      initials: '',
      companyName: 'ASAP',
    };
    this.changedSelectedClients = this.changedSelectedClients.bind(this);
    this.savePaymentRecord = this.savePaymentRecord.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateClientData = this.updateClientData.bind(this);
    this.updateCalculatedValues = this.updateCalculatedValues.bind(this);
  }

  // remove clients who BALT has already finished paying for
  static filterClients(clientData) {
    const filteredClientData = clientData.filter(client => {
      const terminationDate =
        client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET] &&
        getDate(client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET]);
      const paidThroughDate =
        client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET] &&
        getDate(client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]);

      if (!terminationDate) {
        return true;
      }
      if (
        terminationDate > paidThroughDate &&
        DataLayer.getDateDifExclusive(terminationDate, paidThroughDate) > 0
      ) {
        return true;
      }

      const reimbursementOwed =
        client[REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET];
      if (reimbursementOwed) {
        return true;
      }
      return false;
    });
    return filteredClientData;
  }

  static formatClientData(clientData) {
    clientData.forEach(client => {
      const paidThroughDate = client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET];
      const terminationDate = client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET];

      let startDate;
      if (paidThroughDate) {
        startDate = getDate(paidThroughDate.getTime());
        startDate.setDate(paidThroughDate.getDate() + 1);
      }

      const endDate = terminationDate || getDate();

      client.startDate = startDate;
      client.endDate = startDate > endDate ? undefined : endDate;
      client.terminationDate = terminationDate;
    });
    return clientData;
  }

  changedSelectedClients(rowIds) {
    if (rowIds) {
      const selectedClients = this.state.clients.filter((_, index) => {
        return rowIds[index];
      });
      const editedSelectedClients = selectedClients.map(selectedClient => {
        const updatedClient = this.state.selectedClients.find(
          curSelectedClient => {
            return curSelectedClient.id === selectedClient.id;
          }
        );
        return updatedClient || selectedClient;
      });

      this.setState(() => ({
        selectedClients: editedSelectedClients,
      }));
    }
  }

  updateData(val, valToUpdate) {
    this.setState({
      [valToUpdate]: val,
    });
  }

  componentDidMount() {
    this.setState({
      clients: PaymentPage.formatClientData(
        PaymentPage.filterClients(this.context.clientSheetData)
      ),
    });
  }

  savePaymentRecord() {
    this.context.addPaymentRecord(
      this.state.selectedClients,
      this.state.rate,
      this.state.companyName,
      this.state.initials,
      this.state.datePaid
    );
  }

  updateCalculatedValues(client) {
    const { startDate, endDate, terminationDate } = client;
    if (!terminationDate || (terminationDate && terminationDate >= endDate)) {
      const cost =
        DataLayer.getDateDifInclusive(startDate, endDate) * this.state.rate;
      client.reimbursementUsed = '';
      client.paid = `$${cost}`;
    } else {
      const reimbursementEndDate =
        client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET];

      const reimbursement =
        DataLayer.getDateDifExclusive(reimbursementEndDate, terminationDate) *
        this.state.rate; // TODO: should use OLD rate
      client.reimbursementUsed = `$${reimbursement}`;
      client.paid = '';
    }
  }

  updateClientData(row, columnId, value, rowId) {
    // const id = row.values[CLIENT_ID_INDEX_ON_CLIENT_SHEET];

    const newRow = { ...this.state.selectedClients[rowId] };
    newRow[columnId] = value;

    this.updateCalculatedValues(newRow);
    const updatedSelectedClients = [
      ...this.state.selectedClients.slice(0, rowId),
      newRow,
      ...this.state.selectedClients.slice(rowId + 1),
    ];
    this.setState({ selectedClients: updatedSelectedClients });
  }

  render() {
    const headers = this.context.clientSheetHeaders;
    const newHeaders = [
      headers[CLIENT_ID_INDEX_ON_CLIENT_SHEET],
      headers[CLIENT_NAME_INDEX_ON_CLIENT_SHEET],
      headers[NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET],
      headers[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET],
      headers[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET],
    ];

    const clientSheetData = this.state.clients;

    return (
      <div>
        <h1>Payment Page</h1>
        <CollapsableCard title={'Select Clients For Payment'}>
          <ReactTable
            columns={newHeaders}
            data={clientSheetData}
            maxDisplay={10}
            onSelect={this.changedSelectedClients}
          />
        </CollapsableCard>
        <CollapsableCard title={'Choose How Much Was Paid For Client(s)'}>
          <Form.Row className="mb-3">
            <Col>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Client Rate: $/day for company</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="10, 12"
                  value={this.state.rate}
                  onChange={e => this.updateData(e.target.value, 'rate')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Initials of person who paid</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="JB, MF"
                  value={this.state.initials}
                  onChange={e => this.updateData(e.target.value, 'initials')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Company name</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.companyName}
                  onChange={e => this.updateData(e.target.value, 'companyName')}
                >
                  <option>ASAP</option>
                  <option>ALERT</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Date paid</Form.Label>
                <ReactDatePicker
                  selected={this.state.datePaid}
                  onChange={e => this.updateData(e, 'datePaid')}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {this.state.selectedClients.length ? (
            <PaymentRecordTable
              columns={newHeaders}
              clientSheetData={this.state.selectedClients}
              updateData={this.updateClientData}
            ></PaymentRecordTable>
          ) : (
            <Card.Text>No Clients Yet Selected</Card.Text>
          )}
          <Card.Footer>
            <button
              style={{ float: 'right', width: '10rem' }}
              className="btn btn-primary"
              type="button"
              onClick={this.savePaymentRecord}
            >
              Save
            </button>
          </Card.Footer>
        </CollapsableCard>
      </div>
    );
  }
}

export default PaymentPage;
