
import { GET_NOTIFICATIONS, RESET_NOTIFICATION_SEARCH, NOTIFICATION_LOADING } from '../actions/types';

const initialState = {
    items: [],
    count: 0,
    searchParams: {},
    loading: false

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_NOTIFICATIONS:
            return {
                ...state,
                items: action.payload,
                count: action.count,
                searchParams: action.searchParams,
                loading: false
            };
        case RESET_NOTIFICATION_SEARCH:
            return {
                ...state,
                searchParams: action.searchParams
            };
        case NOTIFICATION_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
}

