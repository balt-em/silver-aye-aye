import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Form } from 'react-bootstrap';

// Elle switched to using react table from this to make editing cells easier
// This works just fine in the detail view, so it's not switched,
// but if getting more complex I'd recommend switching off this entirely

class SaaTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false, editedData: [] };
    this.edit = this.edit.bind(this);
  }

  edit() {
    // this can make dates screwy but all our data is getting parsed/stringified on the way to/from server
    const editedData = JSON.parse(JSON.stringify(this.props.data));
    this.setState(() => ({ editMode: true, editedData }));
  }

  render() {
    const { header, data } = this.props;

    const tableBody = data.map((row, i) => (
      <tr key={i} onClick={() => this.props.clickedRow(i)}>
        {this.props.verticalHeader && <th scope="row">{header[i]}</th>}
        {row.map((val, index) => (
          <td key={index}>
            {!this.state.editMode ? (
              val
            ) : (
              <Form.Control type="text" placeholder={val} />
            )}
          </td>
        ))}
      </tr>
    ));
    return (
      <div className="table-wrapper">
        {this.props.editable && (
          <Button
            style={{ float: 'right', marginBottom: '5px' }}
            variant="primary"
            onClick={() => this.edit()}
          >
            Edit
          </Button>
        )}
        <Table striped bordered hover>
          {header && !this.props.verticalHeader && (
            <thead>
              <tr>
                {header.map((val, index) => (
                  <th key={index} scope="col">
                    {val}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>{tableBody}</tbody>
        </Table>
      </div>
    );
  }
}

SaaTable.propTypes = {
  clickedRow: PropTypes.func,
  editable: PropTypes.bool,
  header: PropTypes.array,
  verticalHeader: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

export default SaaTable;
