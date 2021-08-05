import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

class SaaTable extends React.Component {
  render() {
    const header = this.props.data[0];
    const rows = this.props.data.slice(1);
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((val, index) => (
              <th key={index}>{val}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row[1]}>
              {row.map((val, index) => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

SaaTable.propTypes = {
  editable: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

export default SaaTable;
