

import axios from 'axios';
import setAuthToken from '../Utils/setAuthToken';
//import jwt_decode from 'jwt-decode';
import { GET_ERRORS, CLEAR_ERRORS, SET_CURRENT_USER, LOGIN_LOADING } from './types';



export const loginUser = userData => dispatch => {

  dispatch(setLoginLoading(true));
  dispatch({ type: CLEAR_ERRORS, payload: { error: false, errorMessage: "" } })

  axios
    .post('https://vet-ord-api.herokuapp.com/api/korisnici/login/', userData)
    .then(res => {

      let loggedUser = JSON.stringify(res.data.user);
      localStorage.setItem('loggedUser', loggedUser);
      // Save to localStorage
      const { token } = res.data.token;
      // Set token to ls
      localStorage.setItem('jwtToken', res.data.token);
      localStorage.setItem('permissions', res.data.permissions);
      //localStorage.setItem('jwtToken', token);    // potrebno da bi axios imao token uvijek!  / setuje se uvijek na app.js
      console.log("localStorage: ", localStorage);
      // Set token to Auth header
      setAuthToken(token);
      dispatch(setCurrentUser(res.data.user, res.data.permissions));

    })
    .catch(err => {
      dispatch(setLoginLoading(false));
      dispatch({ type: GET_ERRORS, payload: err })

    }
    );
};


// Set logged in user
export const setCurrentUser = (decoded, decodedPermision, isAuth = true) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    isAuth: isAuth,
    permiss: decodedPermision
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('loggedUser');
  localStorage.removeItem('permissions');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}, null, false));
};

export const setLoginLoading = (value) => {
  return {
    type: LOGIN_LOADING,
    payload: value
  };
};