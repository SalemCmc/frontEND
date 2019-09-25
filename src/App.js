

import React, { Component } from 'react';
import Header from './CommonComponents/Header';
import Footer from './CommonComponents/Footer';
import Home from './Home';
import Notifications from './NotificationsComp/Notifications';
import UsersPanel from './UsersComp/UsersPanel';
import Login from './UsersComp/Login';
import UserDetails from './UsersComp/UserDetails';
import UserAdd from './UsersComp/UserAdd';
import AdminPanel from './UsersComp/AdminPanel';
import KontaktiPanel from './ContactsComp/ContactsPanel';
import Appointments from './AppointmentsComp/Appointments';
import MessagesPanel from './MessagesComp/MessagesPanel';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setCurrentUser } from './actions/authActions';  //  , logoutUser  SET LOGGED USER FROM LOCAL STORAGE AND IMPORT TO STATE(STORE)
import setAuthToken from './Utils/setAuthToken';
import PrivateRoute from './CommonComponents/PrivateRoute';
import PriceList from './PriceListComp/PriceList';
import Team from './AboutComp/Team';
import Clinic from './AboutComp/Clinic';
//import jwt_decode from 'jwt-decode';

import { Provider } from 'react-redux';
import store from './store';


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

    return (
      <Provider store={store}>
        <div>
          <Router>
            <Header />
            <div className="custConteiner">
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/Contacts" render={() => (<KontaktiPanel />)} />
              <Route path="/Notifications" component={Notifications} />
              <Route path="/Pricelist" component={PriceList} />
              <Route path="/UserAdd/:id" component={UserAdd} permission="UsersADD" />
              <Route path="/UserDetails/:id" component={UserDetails} permission="UserDETAILS" />
              <Route path="/admin" component={AdminPanel} />
              <Route path="/ourTeam" component={Team} />  
              <Route path="/clinic" component={Clinic} /> 
              <Switch>
                <PrivateRoute exact path="/Messages" component={MessagesPanel} permission="Messages" />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/UsersPanel" component={UsersPanel} permission="Users" />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/Appointments" component={Appointments} permission="Appointments" />
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
