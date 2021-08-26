import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

class SaaTable extends React.Component {
  render() {
    const { header, data } = this.props;
    return (
      <Table striped bordered hover>
        {header && (
          <thead>
            <tr>
              {header.map((val, index) => (
                <th key={index}>{val}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, i) => (
            <tr key={i} onClick={() => this.props.clickedRow(i)}>
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
  header: PropTypes.array,
  data: PropTypes.array.isRequired,
};

export default SaaTable;
