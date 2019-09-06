


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
      checkPermision(rest.path, auth.userPermisions, Component, props, rest)
    ) : (
        <div className="container" >
          <br /><br /><br />
          <center>
            <h4 className="text-danger"> <b>ACCES DENIDED! </b></h4>
            <h4 className="text-warning"> <b>Please log in and try again! </b></h4>
            <br />
            <Link className="btn btn-primary btn-sm" to="/login" >Login </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
           <Link className="btn btn-info btn-sm" to="/KorisniciAdd/new" >Registracija </Link>
          </center>
          <br /><br /><br /><br />
        </div>
      )
    }
  />
);


function checkPermision(path, permissions, Component, props, rest) {

  console.log("PATH: ", path);


  if (permissions.includes(rest.permission)) {
    return <Component {...props} />;
  }
  else {
    return <div className="container" >
      <br /><br /><br />
      <center>
        <h4 className="text-warning"> <b>ACCES DENIDED! </b></h4>
        <h4 className="text-danger"> <b>You don't have permission to acces this content! </b></h4>
        <h6 className="text-warning"> <b>Please go back </b></h6>
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
