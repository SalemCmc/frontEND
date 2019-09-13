
import { GET_DOCTOR_APPOINTMENTS, SET_APPOINTMENTS_ADD_SUCCESS, APPOINTMENTS_LOADING } from '../actions/types';

const initialState = {
    appoByDoctorList: [ [], [], []], // every item is one week (previous, current, next)



    //appoByDoctorList: [],
    appoByClientList: [],
    appoParams: {},
    succesPost: false,
    loading: false
};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_DOCTOR_APPOINTMENTS:
            return {
                ...state,
                appoByDoctorList: action.appoByDoctorList,
                appoParams: action.appoParams,
                loading: false

            };
        case APPOINTMENTS_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        case SET_APPOINTMENTS_ADD_SUCCESS:
            return {
                ...state,
                succesPost: action.succesPost
            };
        default:
            return state;
    }
}

