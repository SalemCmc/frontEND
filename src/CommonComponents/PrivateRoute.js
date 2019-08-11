


import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
// <Redirect to="/login" />
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  
  //test(rest.path, auth.user.rola, Component)
  <Route
    {...rest}
    render={props => auth.isAuthenticated === true ? (


        //uradi switch!
        checkPermision(rest.path, auth.user.rola, Component, props)
      ) : (
          <div className="container" >
            <br /><br /><br />
            <center>
              <h4 className="text-warning"> <b>PAŽNJA! </b></h4>
              <h4 className="text-warning"> <b>Morate biti prijavljeni da bi ste vidjeli ovaj sadržaj! </b></h4>
              <br />
              <Link className="btn btn-primary btn-sm" to="/login" >Login </Link>
              &nbsp;&nbsp;&nbsp;&nbsp;
           <Link className="btn btn-info btn-sm" to="/registracija" >Registracija </Link>
            </center>
            <br /><br /><br /><br />
          </div>
        )
    }
  />
);


var Doktor = ["/Termini", "/Usluge", "/Poruke", "/Korisnici", "/addObavjest", "/KorisniciAdd/:id", "/KorisniciDetails/:id"];
var Klijent = ["/mytermini", "/Poruke", "/Korisnici", "/KorisniciAdd/:id","/Termini" , "/KorisniciDetails/:id"];
var Admin = ["/Administracija", "/Usluge", "/Poruke", "/Korisnici", "/addObavjest", "/KorisniciAdd/:id" , "/KorisniciDetails/:id"];
var role = { "Doktor": Doktor, "Klijent": Klijent, "Admin": Admin };

function checkPermision(path, rola, Component, props) {
  // poslije ovo povezati sa web api i povlaciti permisije za odredjenu rolu....
 // console.log(path);
//  treba omoguciti nelogiranom pristup   "/KorisniciAdd/:id"


  if (role[rola].includes(path)) { console.log("rola:",rola); console.log("path",path);
    return <Component {...props} />;
  }
  else {
    return <div className="container" >
      <br /><br /><br />
      <center>
        <h4 className="text-warning"> <b>PAŽNJA! </b></h4>
        <h4 className="text-warning"> <b>Nemate permisije za pristup ovom sadržaju! </b></h4>
        <br />
      </center>
      <br /><br /><br /><br />
    </div>;
  }

}



PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
