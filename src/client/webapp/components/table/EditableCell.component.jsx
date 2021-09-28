/* eslint-disable no-nested-ternary */
// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';

const EditableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = val => {
    setValue(val);
    updateData(row, id, val);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <ReactDatePicker selected={value} onChange={onChange} />;
};

EditableCell.propTypes = {
  value: PropTypes.instanceOf(Date),
  row: PropTypes.object,
  column: PropTypes.object,
  updateData: PropTypes.func,
};

export default EditableCell;
