import React from 'react';
import DataLayer, { DataLayerContext } from '@utils/DataLayer.component';
import {
  CLIENT_ID_INDEX_ON_CLIENT_SHEET,
  PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET,
  TERMINATION_DATE_INDEX_ON_CLIENT_SHEET,
  REIMBURSEMENT_OWED_INDEX_ON_CLIENT_SHEET,
  NUMBER_OF_DAYS_OWED_INDEX_ON_CLIENT_SHEET,
  CLIENT_NAME_INDEX_ON_CLIENT_SHEET,
} from '@shared/sheetconfig';
import { Card } from 'react-bootstrap';
import ReactTable from '../../components/table/ReactTable.component';
import CollapsableCard from '../../components/CollapsableCard.component';
import PaymentRecordTable from '../../components/PaymentRecordTable.component';

class PaymentPage extends React.Component {
  static contextType = DataLayerContext;

  constructor(props) {
    super(props);
    this.state = { selectedClients: {}, clients: [] };
    this.changedSelectedClients = this.changedSelectedClients.bind(this);
  }

  // remove clients who BALT has already finished paying for
  static filterClients(clientData) {
    const filteredClientData = clientData.filter(client => {
      const terminationDate =
        client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET] &&
        new Date(client[TERMINATION_DATE_INDEX_ON_CLIENT_SHEET]);
      const paidThroughDate =
        client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET] &&
        new Date(client[PAID_THROUGH_DATE_INDEX_ON_CLIENT_SHEET]);

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

  componentDidMount() {
    this.setState({
      clients: PaymentPage.filterClients(this.context.clientSheetData),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  changedSelectedClients(rowIds) {
    if (rowIds) {
      this.setState(() => ({
        selectedClients: rowIds,
      }));
    }
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

    const selectedClientData = clientSheetData.filter((clientData, index) => {
      return this.state.selectedClients[index];
    });

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
          {selectedClientData.length ? (
            <PaymentRecordTable
              columns={newHeaders}
              clientSheetData={selectedClientData}
            ></PaymentRecordTable>
          ) : (
            <Card.Text>No Clients Yet Selected</Card.Text>
          )}
        </CollapsableCard>
      </div>
    );
  }
}

export default PaymentPage;
