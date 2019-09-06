//import isEmpty from '../validation / is - empty';

import { SET_CURRENT_USER, LOGIN_LOADING } from '../actions/types';
//import { getDateString } from '../Utils/DateUtils';

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: action.isAuth,                 //true, //!isEmpty(action.payload),
        user: action.payload
        , userPermisions: action.permiss
        , loading: false
      };
    case LOGIN_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}