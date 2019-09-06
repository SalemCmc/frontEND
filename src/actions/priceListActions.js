

import { GET_PRICELIST } from './types';
import { getPriceList } from "../WebApis/requestsGraphQL.js";

export const getPriceListA = testData => async dispatch => {


  let pList = await getPriceList();

  dispatch({
    type: GET_PRICELIST,
    payload: pList
  })
};
