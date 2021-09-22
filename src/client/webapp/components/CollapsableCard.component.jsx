import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

class CollapsableCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: true, id: Math.random().toString() };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      display: !this.state.display,
    });
  }

  render() {
    const { display, id } = this.state;

    return (
      <Card style={{ marginBottom: '15px' }}>
        <Card.Body>
          <Card.Title>
            {this.props.title}
            <button
              style={{ float: 'right', width: '10rem' }}
              className="btn btn-primary"
              type="button"
              aria-expanded={display.toString()}
              aria-controls={id}
              onClick={this.toggle}
            >
              {this.state.display ? 'Collapse' : 'Show'}
            </button>
          </Card.Title>
          <div style={this.state.display ? {} : { display: 'none' }} id={id}>
            {this.props.children}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

CollapsableCard.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};

export default CollapsableCard;
