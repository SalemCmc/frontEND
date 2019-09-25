
import { GET_USERS_SHORT, GET_USERS, GET_USER, UPDATE_USER, USERS_LOADING ,GET_OUR_TEAM,TEAM_LOADING} from '../actions/types';

const initialState = {
    items: [],
    count: 0,
    user: {},
    usersShortList: [],
    userUpdate: {},
    searchParams: {},
    loading: false,
    ourTeam:[],
    loadingTeam:false

};

export default function (state = initialState, action) {

    switch (action.type) { 
        case GET_OUR_TEAM:
            return {
                ...state,
                ourTeam: action.ourTeam,
                loadingTeam: false
            };
        case GET_USERS_SHORT:
            return {
                ...state,
                usersShortList: action.usersShortList,
                loading: false
            };
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
        case TEAM_LOADING:
             return {
                    ...state,
                    loadingTeam: action.payload
                };
        default:
            return state;
    }
}

