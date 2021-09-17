import React from 'react';
import DataLayer from '@utils/DataLayer.component';
import NavBarSaa from './components/NavBar.saa.component';
import OverviewPage from './pages/overview/Overview.page';
import PaymentPage from './pages/payment/Payment.page';
import SearchPage from './pages/search/Search.page';
import LoadingPage from './pages/loading/Loading.page';

class WebApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { route: '#payment' };
    this.setRoute = this.setRoute.bind(this);
  }

  setRoute(route) {
    this.setState(() => {
      return { route };
    });
  }

  render() {
    let body;
    if (this.state.route === '#overview') {
      body = <OverviewPage></OverviewPage>;
    } else if (this.state.route === '#search') {
      body = <SearchPage></SearchPage>;
    } else if (this.state.route === '#payment') {
      body = <PaymentPage></PaymentPage>;
    }
    return (
      <div>
        <NavBarSaa
          setRoute={this.setRoute}
          route={this.state.route}
        ></NavBarSaa>
        <div id="main">
          <DataLayer
            element={body}
            loadingPage={<LoadingPage></LoadingPage>}
          ></DataLayer>
        </div>
      </div>
    );
  }
}

export default WebApp;
