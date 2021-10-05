// Normally a good rule, but VerticalReactTable adds keys with its' props. As long as you add those you should be good
/* eslint-disable react/jsx-key */

// Much of this code was taken from the React Table documentation: https://react-table.tanstack.com/docs/overview
import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';

import Cell from './Cell.component';
import EditableTextCell from './EditableTextCell.component';

const defaultColumn = {
  Cell,
  EditableCell: EditableTextCell,
};
function VerticalReactTable(props) {
  const [editMode, setEditMode] = useState(false);

  const save = newEditMode => {
    setEditMode(newEditMode);
    if (newEditMode === false) {
      props.onSave();
    }
  };

  const data = React.useMemo(() => props.data, [props.data]);

  const columns = React.useMemo(() => props.columns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, defaultColumn, updateData: props.onChange });
  const row = rows[0];
  prepareRow(row);

  return (
    <div className="table-wrapper">
      {props.editable && (
        <Button
          style={{ float: 'right', marginBottom: '5px' }}
          variant="primary"
          onClick={() => save(!editMode)}
        >
          {editMode ? 'Save' : 'Edit'}
        </Button>
      )}
      <Table
        striped
        bordered
        hover
        {...getTableProps()}
        style={{
          width: '100%',
          overflowX: 'auto',
          display: 'block',
        }}
        className={'vertical-table'}
      >
        <tbody {...getTableBodyProps()}>
          {headerGroups.map(headerGroup => {
            return headerGroup.headers.map((column, index) => {
              const cell = row.cells[index];
              return (
                <tr {...column.getHeaderProps()}>
                  <th>
                    <div className="scrollable">{column.render('Header')}</div>
                  </th>
                  <td {...cell.getCellProps()}>
                    <div className="scrollable">
                      {editMode
                        ? cell.render('EditableCell')
                        : cell.render('Cell')}
                    </div>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </Table>
    </div>
  );
}

VerticalReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  editable: PropTypes.bool,
};

export default VerticalReactTable;
