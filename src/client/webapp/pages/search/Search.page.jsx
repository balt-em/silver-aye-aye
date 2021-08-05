import React from 'react';
import PropTypes from 'prop-types';
import SaaTable from '../../components/Table.saa.component';

class SearchPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Search Page</h1>
        {/* <p>{this.props.data}</p> */}
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
