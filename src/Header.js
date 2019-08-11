import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import { logoutUser } from './actions/authActions';
//import { clearCurrentProfile } from './actions/profileActions';

class Header extends Component {

  onLogoutClick(e) {
    // e.preventDefault();             //   ISTRAZITI ???
    // this.props.clearCurrentProfile();
    this.props.logoutUser();

  }

  render() {    //    console.log("LOGED USEER: ", this.props.auth);
    let authenticatedTag = null;
    let doktorTag = null;
    let klijentTag = null;
    let adminTag = null;

    if (this.props.auth.isAuthenticated === true) {

      if (this.props.auth.user.rola === "Doktor") {
        doktorTag = <ul className="navbar-nav">  <li className="nav-item"><Link className="nav-link" to="/Termini">Appointments</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/Usluge">Pružene uslge</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/Korisnici">Clients/Users</Link></li>
        </ul>
      }
      if (this.props.auth.user.rola === "Admin") {
        adminTag = <ul className="navbar-nav">  <li className="nav-item"><Link className="nav-link" to="/Poruke">Administracija</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/Korisnici">Clients/Users</Link></li>
        </ul>
      }
      if (this.props.auth.user.rola === "Klijent") {
        klijentTag = <ul className="navbar-nav">  <li className="nav-item"><Link className="nav-link" to="/Termini">My appointments</Link></li> </ul>
      }

      authenticatedTag = <ul className="navbar-nav">   <li className="nav-item"><Link className="nav-link" to="/Poruke">Messages</Link></li>
        &nbsp; &nbsp; &nbsp;
                                                          <li className="nav-item dropdown show">
          <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="0" role="button" aria-haspopup="false" aria-expanded="false">{this.props.auth.user.userName} &nbsp;</a>
          <div className="dropdown-menu" x-placement="bottom-start">
      
            <a className="dropdown-item" href={"/KorisniciDetails/" + this.props.auth.user.id}><span role="img" aria-label=""> &#9998; &nbsp; &nbsp;</span> My profile</a>
            <Link className="dropdown-item" to={"/"} onClick={(e) => this.onLogoutClick(e)}>  <span role="img" aria-label=""> &#128273;&nbsp; &nbsp;Log Out</span>    </Link>
          </div>
        </li>
        <li className="nav-item"><img src={this.props.auth.user.avatar} className="avatar" alt="your avatar" /> </li>&nbsp; &nbsp;
                            </ul>;
    }
    else {
      authenticatedTag = <ul className="navbar-nav">
        <li className="nav-item"> <Link className="nav-link" to="/login">Login</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/KorisniciAdd/new">Registration</Link> </li>
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
              </ul>
            {doktorTag}{adminTag}{klijentTag}
            <ul className="navbar-nav">

              <li className="nav-item">
                <Link className="nav-link" to="/Obavjesti">Notifications</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Kontakti">Contacts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pricelist">Price list</Link>
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