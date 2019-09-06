

import React, { Component } from 'react';
import Header from './CommonComponents/Header';
import Footer from './CommonComponents/Footer';
import Home from './Home';
import Obavjesti from './NotificationsComp/Obavjesti';
import ObavjestiAdd from './NotificationsComp/ObavjestiAdd';
import Korisnici from './KorisniciComp/Korisnici';
import Login from './KorisniciComp/Login';
import KorisniciDetails from './KorisniciComp/KorisniciDetails';
import KorisniciAdd from './KorisniciComp/KorisniciAdd';
import AdminPanel from './KorisniciComp/AdminPanel';
import Usluge from './UslugeComp/Usluge';
import KontaktiPanel from './Kontakti/KontaktiPanel';
import Termini from './TerminiComp/Termini';
import Poruke from './PorukeComp/Poruke';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setCurrentUser } from './actions/authActions';  //  , logoutUser  SET LOGGED USER FROM LOCAL STORAGE AND IMPORT TO STATE(STORE)
import setAuthToken from './Utils/setAuthToken';
import PrivateRoute from './CommonComponents/PrivateRoute';
import PriceList from './PriceListComp/PriceList';
//import jwt_decode from 'jwt-decode';

import { Provider } from 'react-redux';
import store from './store';
//       npm update           --ako ima problema sa reduxom!
//  <Route path="/Poruke" render={()=> (<Poruke />)} />

//let user = { Username: "Doktor", Password: "Doktor" }
//let user = { Username: "admin", Password: "admin" }
//let user = { Username: "sara", Password: "sara" }



//console.log("LS USER:  APP: ", localStorage.loggedUser);


///                      ---------------------------   GET LOGGED USER FROM LOCAL STORAGE AND IMPORT TO STATE(STORE)
if (localStorage.loggedUser && localStorage.jwtToken) {
  let loggUser = JSON.parse(localStorage.loggedUser);
  let permUser = localStorage.permissions.split(",");


  store.dispatch(setCurrentUser(loggUser, permUser));
  // podesi token
  setAuthToken(localStorage.jwtToken);

  // Check for expired token               ------------  POSLIJE!
  //const decoded = jwt_decode(localStorage.jwtToken);
  //const currentTime = Date.now() / 1000;
  //if (decoded.exp < currentTime) {
  // Logout user
  // store.dispatch(logoutUser());
  // Clear current Profile
  // store.dispatch(clearCurrentProfile());
  // Redirect to login
  // window.location.href = '/login';
  //}
}

class App extends Component {


  render() {
    // console.log("okinut APP!");

    return (
      <Provider store={store}>
        <div>
          <Router>
            <Header />
            <div className="custConteiner">
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/Kontakti" render={() => (<KontaktiPanel />)} />
              <Route path="/Obavjesti" component={Obavjesti} />
              <Route path="/pricelist" component={PriceList} />
              <Route path="/KorisniciAdd/:id" component={KorisniciAdd} permission="UsersADD" />
              <Route path="/KorisniciDetails/:id" component={KorisniciDetails} permission="UserDETAILS" />
              <Route path="/admin" component={AdminPanel} />
              <Switch>
                <PrivateRoute exact path="/Poruke" component={Poruke} permission="Messages" />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/addObavjest" component={ObavjestiAdd} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/Korisnici" component={Korisnici} permission="Users" />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/Usluge" component={Usluge} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/Termini" component={Termini} permission="Appointments" />
              </Switch>
            </div>
            <Footer />
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
