import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

const EditableTextArea = props => {
  const [editedValue, setEditedValue] = React.useState(props.value);
  const [editMode, setEditMode] = React.useState(false);

  const save = newEditMode => {
    setEditMode(newEditMode);
    if (newEditMode === false) {
      props.onSave(editedValue);
    }
  };

  return (
    <>
      <Button
        style={{ float: 'right', marginBottom: '5px' }}
        variant="primary"
        onClick={() => save(!editMode)}
      >
        {editMode ? 'Save' : 'Edit'}
      </Button>
      {editMode ? (
        <Form.Control
          value={editedValue}
          as="textarea"
          rows={10}
          aria-label="notes"
          onChange={e => setEditedValue(e.target.value)}
        />
      ) : (
        <p>{props.value}</p>
      )}
    </>
  );
};

EditableTextArea.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func,
};

export default EditableTextArea;
