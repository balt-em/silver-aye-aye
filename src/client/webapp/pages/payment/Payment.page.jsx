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
      selectedClients: {},
      clients: [],
      rate: 12,
      datePaid: getDate(),
      initials: '',
      companyName: 'ASAP',
    };
    this.changedSelectedClients = this.changedSelectedClients.bind(this);
    this.savePaymentRecord = this.savePaymentRecord.bind(this);
    this.getSelectedClients = this.getSelectedClients.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateClientData = this.updateClientData.bind(this);
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

  getSelectedClients() {
    return this.state.clients.filter((_, index) => {
      return this.state.selectedClients[index];
    });
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
    const clients = this.getSelectedClients();
    this.context.addPaymentRecord(
      clients,
      this.state.rate,
      this.state.companyName,
      this.state.initials,
      this.state.datePaid
    );
  }

  // eslint-disable-next-line class-methods-use-this
  changedSelectedClients(rowIds) {
    if (rowIds) {
      this.setState(() => ({
        selectedClients: rowIds,
      }));
    }
  }

  updateClientData(row, columnId, value) {
    const id = row.values[CLIENT_ID_INDEX_ON_CLIENT_SHEET];

    const oldRow = this.state.clients.find(
      client => client[CLIENT_ID_INDEX_ON_CLIENT_SHEET] === id
    );
    console.log('this.state.clients[rowIndex]', oldRow, columnId, value);
    oldRow[columnId] = value;
    // const newRow = { ...oldRow, [columnId]: value };
    // const newClientSheetData = [...this.state.clients];
    // newClientSheetData[rowIndex] = newRow;

    // this.setState({ clients: newClientSheetData });
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

    const selectedClientData = this.getSelectedClients();

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
          {selectedClientData.length ? (
            <PaymentRecordTable
              columns={newHeaders}
              clientSheetData={selectedClientData}
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
