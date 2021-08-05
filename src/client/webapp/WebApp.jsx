import React from 'react';
// import { Navbar, Container, Nav } from 'react-bootstrap';
import DataLayer from './components/DataLayer.component';
import NavBarSaa from './components/NavBar.saa.component';
import OverviewPage from './pages/overview/Overview.page';
import PaymentPage from './pages/payment/Payment.page';
import SearchPage from './pages/search/Search.page';

class WebApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clientData: [], totals: {}, route: '#overview' };
    this.setRoute = this.setRoute.bind(this);
  }

  setRoute(route) {
    this.setState(() => {
      return { route };
    });
  }

  render() {
    // const { totals } = this.state;
    let body;
    if (this.state.route === '#overview') {
      body = <OverviewPage {...DataLayer.undefinedProps}></OverviewPage>;
    } else if (this.state.route === '#search') {
      body = <SearchPage {...DataLayer.undefinedProps}></SearchPage>;
    } else if (this.state.route === '#payment') {
      body = <PaymentPage {...DataLayer.undefinedProps}></PaymentPage>;
    }
    return (
      <div>
        <NavBarSaa
          setRoute={this.setRoute}
          route={this.state.route}
        ></NavBarSaa>
        <div id="main">
          <DataLayer element={body}></DataLayer>
        </div>
      </div>
    );
  }
}

export default WebApp;
