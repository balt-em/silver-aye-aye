/* eslint-disable no-nested-ternary */
// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

EditableCell.propTypes = {
  value: PropTypes.instanceOf(Date),
  row: PropTypes.object,
  column: PropTypes.object,
  updateMyData: PropTypes.func,
};

export default EditableCell;
