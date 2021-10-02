import React from 'react';
import PropTypes from 'prop-types';
import DataLayer from '../../utils/DataLayer.component';

const Cell = props => {
  const val =
    props.value instanceof Date
      ? DataLayer.getReadableDate(props.value)
      : props.value;

  return <span>{val}</span>;
};

Cell.propTypes = {
  value: PropTypes.any,
};

export default Cell;
