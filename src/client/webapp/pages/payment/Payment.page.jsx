import React from 'react';
import { DataLayerContext } from '@utils/DataLayer.component';
import { CLIENT_ID_INDEX_ON_CLIENT_SHEET } from '@shared/sheetconfig';
import { Card } from 'react-bootstrap';
import ReactTable from '../../components/ReactTable.component';
import CollapsableCard from '../../components/CollapsableCard.component';

class PaymentPage extends React.Component {
  static contextType = DataLayerContext;

  constructor(props) {
    super(props);
    this.state = { selectedClients: {} };
    this.clickedClient = this.clickedClient.bind(this);
    this.removeClient = this.removeClient.bind(this);
  }

  clickedClient(id) {
    const newSelectedClients = { ...this.state.selectedClients };
    newSelectedClients[id] = 1;
    console.log('clickedClient', id);
    this.setState(() => ({
      selectedClients: newSelectedClients,
    }));
  }

  removeClient(id) {
    const newSelectedClients = { ...this.state.selectedClients };
    newSelectedClients[id] = undefined;
    console.log('removeClient', id);
    this.setState(() => ({
      selectedClients: newSelectedClients,
    }));
  }

  render() {
    const { clientSheetData, clientSheetHeaders } = this.context;

    // could be done once instead of twice
    const filteredClientData = clientSheetData.filter(clientData => {
      return !this.state.selectedClients[
        clientData[CLIENT_ID_INDEX_ON_CLIENT_SHEET]
      ];
    });

    const selectedClientData = clientSheetData.filter(clientData => {
      return this.state.selectedClients[
        clientData[CLIENT_ID_INDEX_ON_CLIENT_SHEET]
      ];
    });

    return (
      <div>
        <h1>Payment Page</h1>
        <CollapsableCard title={'Select Clients to Pay For'}>
          <ReactTable
            columns={clientSheetHeaders}
            data={filteredClientData}
            clickedRow={this.clickedClient}
            maxDisplay={5}
          />
        </CollapsableCard>
        <CollapsableCard title={'Indate How Much To Pay For Client'}>
          {selectedClientData.length ? (
            <div id="collapseExample">
              <ReactTable
                columns={clientSheetHeaders}
                data={selectedClientData}
                clickedRow={this.removeClient}
                maxDisplay={100}
              />
            </div>
          ) : (
            <Card.Text>No Clients Yet Selected</Card.Text>
          )}
        </CollapsableCard>
      </div>
    );
  }
}

export default PaymentPage;
