import { GET_CONTACTS } from '../actions/types';

const initialState = {
  contactsList: []

};

export default function (state = initialState, action) {

  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contactsList: action.payload
      };
    default:
      return state;
  }
}

