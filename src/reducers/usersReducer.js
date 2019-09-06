
import { GET_USERS,GET_USER,UPDATE_USER, USERS_LOADING } from '../actions/types';

const initialState = {
    items: [],
    count: 0,
    user:{},
    userUpdate:{},
    searchParams: {},
    loading: false

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                items: action.payload,
                count: action.count,
                searchParams: action.searchParams,
                loading: false
            };
        case GET_USER:
                return {
                    ...state,
                    user: action.payload,
                    loading: false
                };
        case UPDATE_USER:
                return {
                    ...state,
                    userUpdate: action.payload,
                    loading: false
                };
        case USERS_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
}

