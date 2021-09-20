/* eslint-disable no-nested-ternary */
// Normally a good rule, ReactTable adds keys with it's props as long as you add those you should be good
/* eslint-disable react/jsx-key */
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
