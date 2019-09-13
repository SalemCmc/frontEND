

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import priceListReducer from './priceListReducer';
import contactsReducer from './contactsReducer';
import notificationsReducer from './notificationsReducer';
import errorReducer from './errorReducer';
import usersReducer from './usersReducer';
import petsReducer from './petsReducer';
import messagesReducer from './messagesReducer';
import appointmentsReducer from './appointmentsReducer';

export default combineReducers({
  auth: authReducer,
  price: priceListReducer,
  contacts: contactsReducer,
  notifications: notificationsReducer,
  errors: errorReducer,
  users: usersReducer,
  pets: petsReducer,
  messages:messagesReducer,
  appointments: appointmentsReducer
  
  // profile: profileReducer,
  // post: postReducer
});
