
import { GET_PRICELIST } from '../actions/types';

const initialState = {
  priceList: []

};

export default function (state = initialState, action) {

  switch (action.type) {
    case GET_PRICELIST:
      return {
        ...state,
        priceList: action.payload
      };
    default:
      return state;
  }
}

