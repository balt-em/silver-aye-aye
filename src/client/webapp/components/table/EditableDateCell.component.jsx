import { normalizeDate } from '@shared/utils';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';

const EditableDateCell = ({
  value,
  row,
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}) => {
  const onChange = val => {
    normalizeDate(val);
    updateData(row, id, val, row.id);
  };

  return <ReactDatePicker selected={value} onChange={onChange} isClearable />;
};

EditableDateCell.propTypes = {
  value: PropTypes.instanceOf(Date),
  row: PropTypes.object,
  column: PropTypes.object,
  updateData: PropTypes.func,
};

export default EditableDateCell;
