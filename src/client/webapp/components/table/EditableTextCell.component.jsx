import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const EditableTextCell = ({
  value,
  row,
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}) => {
  const onChange = val => {
    updateData(row, id, val, row.id);
  };

  return (
    <Form.Control
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

EditableTextCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  row: PropTypes.object,
  column: PropTypes.object,
  updateData: PropTypes.func,
};

export default EditableTextCell;
