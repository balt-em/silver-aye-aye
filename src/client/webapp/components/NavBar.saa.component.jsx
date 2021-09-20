import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

class NavBarSaa extends React.Component {
  render() {
    return (
      <Navbar bg="light" fixed="top" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => this.props.setRoute('#overview')}>
            BALT - EM App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                onClick={() => this.props.setRoute('#overview')}
                className={this.props.route === '#overview' ? 'active' : ''}
              >
                Overview
              </Nav.Link>
              <Nav.Link
                onClick={() => this.props.setRoute('#search')}
                className={this.props.route === '#search' ? 'active' : ''}
              >
                Search
              </Nav.Link>
              <Nav.Link
                onClick={() => this.props.setRoute('#payment')}
                className={this.props.route === '#payment' ? 'active' : ''}
              >
                Add Payment Record
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

NavBarSaa.propTypes = {
  setRoute: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

export default NavBarSaa;
