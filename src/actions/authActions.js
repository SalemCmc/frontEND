

import axios from 'axios';
import setAuthToken from '../Utils/setAuthToken';
//import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';


// Login - Get User Token
export const loginUser = userData => dispatch => {
  // console.log("AKCIJA OKINUTA!");
  axios
    .post('https://vet-ord-api.herokuapp.com/api/korisnici/login/', userData)
    .then(res => {

      let loggedUser = JSON.stringify(res.data.user);
      localStorage.setItem('loggedUser', loggedUser);
      // let ime = JSON.parse(user).userName;
      // console.log("JSON USERA: ", ime);

      // Save to localStorage
      const { token } = res.data.token;
      // Set token to ls
      localStorage.setItem('jwtToken', token);    // potrebno da bi axios imao token uvijek!  / setuje se uvijek na app.js
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      //const decoded = jwt_decode(token);
      // Set current user

      dispatch(setCurrentUser(res.data.user));
      //dispatch(setCurrentUser(res.data));
    })
    .catch(err => {
      console.log("AXIOS LOGIN ERROR: ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Set logged in user
export const setCurrentUser = (decoded, isAuth = true) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    isAuth: isAuth
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('loggedUser');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}, false));
};