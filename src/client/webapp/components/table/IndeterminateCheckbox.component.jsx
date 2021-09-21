/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { useRowSelect } from 'react-table';
import PropTypes from 'prop-types';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

export const selectUseTableFunctions = onClick => [
  useRowSelect,
  hooks => {
    hooks.visibleColumns.push(cols => [
      // Let's make a column for selection
      {
        id: 'selection',
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        // eslint-disable-next-line react/prop-types
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div onClick={() => onClick()}>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <div onClick={() => onClick()}>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...cols,
    ]);
  },
];

export default IndeterminateCheckbox;
