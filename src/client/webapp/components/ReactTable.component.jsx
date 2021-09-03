// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
import React from 'react';
import { Table } from 'react-bootstrap';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';

function ReactTable(props) {
  const data = React.useMemo(() => props.data, []);

  const columns = React.useMemo(() => props.columns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <Table
      striped
      bordered
      hover
      {...getTableProps()}
      style={{
        width: '95vw',
        overflowX: 'auto',
        display: 'block',
      }}
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                <div className="scrollable">{column.render('Header')}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} onClick={() => props.clickedRow(i)}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()}>
                    <div className="scrollable">{cell.render('Cell')}</div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

ReactTable.propTypes = {
  clickedRow: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default ReactTable;
