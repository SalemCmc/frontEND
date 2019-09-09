
import { GET_EMPLOYEE_SENDERS, GET_CLIENT_SENDERS, GET_COUNT_NEW_MSG, MESSAGE_LOADING } from '../actions/types';

const initialState = {
    clients: [],
    employees: [],
    searchParams: {
        searchString: { "Client": "", "Employee": "" }
        //  row: { "Client": 0, "Employee": 0 }
    },
    countNewMessages: {},
    loading: false

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_CLIENT_SENDERS:
            return {
                ...state,
                clients: action.payload,
                searchParams: action.searchParams,
                loading: false
            };
        case GET_EMPLOYEE_SENDERS:
            return {
                ...state,
                employees: action.payload,
                searchParams: action.searchParams,
                loading: false
            };
        case GET_COUNT_NEW_MSG:
            return {
                ...state,
                countNewMessages: action.payload,
            };
        case MESSAGE_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
}

