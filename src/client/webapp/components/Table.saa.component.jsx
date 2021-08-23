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
          {rows.map((row, i) => (
            <tr key={row[1]} onClick={() => this.props.clickedRow(i)}>
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
  clickedRow: PropTypes.func,
  editable: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

export default SaaTable;
