/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
import React from 'react';
import { Table } from 'react-bootstrap';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import PropTypes from 'prop-types';

import Cell from './Cell.component';
import { selectUseTableFunctions } from './IndeterminateCheckbox.component';

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
          marginBottom: '10px',
        }}
      />
    </span>
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  setGlobalFilter: PropTypes.func,
  globalFilter: PropTypes.string,
};

const defaultColumn = {
  Cell,
};
function ReactTable(props) {
  const data = React.useMemo(() => props.data, [props.data]);

  const columns = React.useMemo(() => props.columns, []);

  const useTableArgs = [
    { columns, data, defaultColumn, updateData: props.updateData },
    useGlobalFilter,
    useSortBy,
  ];

  if (props.onSelect) {
    useTableArgs.push(...selectUseTableFunctions(props.onSelect));
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { selectedRowIds },
  } = useTable(...useTableArgs);

  if (props.onSelect) {
    React.useEffect(() => {
      props.onSelect(selectedRowIds);
    }, [selectedRowIds]);
  }

  const firstPageRows = rows.slice(0, props.maxDisplay);

  return (
    <>
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
          width: '100%',
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
                onClick={() => props.clickedRow(row.index)}
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
    </>
  );
}

ReactTable.propTypes = {
  clickedRow: PropTypes.func,
  onSelect: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
  maxDisplay: PropTypes.number,
  updateData: PropTypes.func,
};

ReactTable.defaultProps = {
  clickedRow: () => undefined,
};

export default ReactTable;
