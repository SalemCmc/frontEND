import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import { logoutUser } from '../actions/authActions';


class Header extends Component {

  onLogoutClick(e) {
    // e.preventDefault();             //   ISTRAZITI ???
    // this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    // console.log("LOGED USEER header: ", this.props);
    let authenticatedTag = null;
    let usersTag = null;
    let appointmentsTag = null;
    let messagesTag = null;
    let servicesTag = null;

    if (this.props.auth.isAuthenticated === true) {
      authenticatedTag = <ul className="navbar-nav">
        <li className="nav-item dropdown show">
          <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="0" role="button" aria-haspopup="false" aria-expanded="false">{this.props.auth.user.userName} &nbsp;</a>
          <div className="dropdown-menu" x-placement="bottom-start">
            <a className="dropdown-item" href={"/UserDetails/" + this.props.auth.user.id}><span role="img" aria-label=""> &#9998; &nbsp; &nbsp;</span> My profile</a>
            <Link className="dropdown-item" to={"/"} onClick={(e) => this.onLogoutClick(e)}>  <span role="img" aria-label=""> &#128273;&nbsp; &nbsp;Log Out</span>    </Link>
          </div>
        </li>
        <li className="nav-item"><img src={this.props.auth.user.avatar} className="avatar" alt="your avatar" /> </li>&nbsp; &nbsp;
                          </ul>;
      //  APOINTMENTS:
      if (this.props.auth.userPermisions.includes("Appointments")) {
        if (this.props.auth.user.rola === "Doctor") {
          appointmentsTag = <li className="nav-item"><Link className="nav-link" to="/Termini">Appointments</Link></li>
        }
        else {
          appointmentsTag = <li className="nav-item"><Link className="nav-link" to="/Termini">My appointments</Link></li>
        }
      }
      // SERVICES:
      if (this.props.auth.userPermisions.includes("Services")) {
        servicesTag = <li className="nav-link" to="/Usluge">Medical services</li>;
      }
      // users:
      if (this.props.auth.userPermisions.includes("Users")) {
        usersTag = <li className="nav-item"><Link className="nav-link" to="/UsersPanel">Clients/Users</Link></li>;
      }
      // messages:
      if (this.props.auth.userPermisions.includes("Messages")) {
        messagesTag = <li className="nav-item"><Link className="nav-link" to="/Messages">Messages</Link></li>;
      }
    }
    else {
      authenticatedTag = <ul className="navbar-nav">
        <li className="nav-item"> <Link className="nav-link" to="/login">Login</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/UserAdd/registration">Registration</Link> </li>
      </ul>;
    }

    return (
      <div className="navbar navbar-expand-lg  navbar-dark bg-primary" >
        <div className="container">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="true" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse show" id="navbarResponsive" styles="">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              {appointmentsTag}{servicesTag}{usersTag}{messagesTag}
              <li className="nav-item">
                <Link className="nav-link" to="/Notifications">Notifications</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Contacts">Contacts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Pricelist">Price list</Link>
              </li>
            </ul>
            {authenticatedTag}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth
});
//export default Header;
export default connect(mapStateToProps, { logoutUser })(Header);