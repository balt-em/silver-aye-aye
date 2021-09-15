/* eslint-disable no-nested-ternary */
// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
import React from 'react';
import { Table } from 'react-bootstrap';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import PropTypes from 'prop-types';

import { CLIENT_ID_INDEX_ON_CLIENT_SHEET } from '@shared/sheetconfig';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows ? preGlobalFilteredRows.length : 0;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = val => {
    setGlobalFilter(val || undefined);
  };

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
        }}
      />
    </span>
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.object,
  setGlobalFilter: PropTypes.func,
};

function ReactTable(props) {
  const data = React.useMemo(() => props.data, []);

  const columns = React.useMemo(() => props.columns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const firstPageRows = rows.slice(0, 50);

  return (
    <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
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
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div className="scrollable">
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() =>
                  props.clickedRow(
                    row.cells[CLIENT_ID_INDEX_ON_CLIENT_SHEET].value
                  )
                }
              >
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
      <div>
        Showing the first {firstPageRows.length} results of {rows.length} rows
      </div>
    </div>
  );
}

ReactTable.propTypes = {
  clickedRow: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default ReactTable;