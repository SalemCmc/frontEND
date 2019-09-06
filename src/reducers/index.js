

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import priceListReducer from './priceListReducer';
import contactsReducer from './contactsReducer';
import notificationsReducer from './notificationsReducer';
import errorReducer from './errorReducer';
import usersReducer from './usersReducer';
// import postReducer from './postReducer';

export default combineReducers({
  auth: authReducer,
  price: priceListReducer,
  contacts: contactsReducer,
  notifications: notificationsReducer,
  errors: errorReducer,
  users: usersReducer
  // profile: profileReducer,
  // post: postReducer
});
