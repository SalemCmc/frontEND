

import { GET_CONTACTS } from './types';
import { getContacts } from "../WebApis/requestsGraphQL.js";

export const getContactsA = testData => async dispatch => {


    let contactsList = await getContacts();


    dispatch({
        type: GET_CONTACTS,
        payload: contactsList
    })
};


