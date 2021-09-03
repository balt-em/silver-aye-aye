import React from 'react';
import { Spinner } from 'react-bootstrap';

class LoadingPage extends React.Component {
  render() {
    return (
      <div>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }
}

export default LoadingPage;
