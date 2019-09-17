
import { GET_DOCTOR_APPOINTMENTS,GET_CLIENT_APPOINTMENTS, SET_APPOINTMENTS_ADD_SUCCESS, APPOINTMENTS_LOADING, GET_DETAILS_APPOINTMENT, GET_REGISTER_APPOINTMENT, SET_APPOINTMENTS_MODAL_ERROR, APPOINTMENTS_MODAL_LOADING } from '../actions/types';

const initialState = {
    appoByDoctorList: [[], [], []], // every item is one week (previous, current, next)
    appoByClient: {count: 0, items: []},
    searchParams:{row:0, limit:0},
    currentWeek: (new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1))),  // INITIAL (THIS MONDAY)
    loading: false,

    // VARIABLES FOR MODALS...

    loadingModal: true,
    succesPost: false,
    modalErrors: { error: false, errorMessage: "" },
    // DETAILS DATA
    appoDetails: {},
    //REGISTRATION DATA
    pets: [],
    medicalServices: [],

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_DOCTOR_APPOINTMENTS:
            return {
                ...state,
                appoByDoctorList: action.appoByDoctorList,
                currentWeek: action.currentWeek,
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
        // MODALS: 

        case APPOINTMENTS_MODAL_LOADING:
            return {
                ...state,
                loadingModal: action.load
            };
        case GET_DETAILS_APPOINTMENT:
            return {
                ...state,
                appoDetails: action.appoDetails,
                loadingModal: false,
            };
        case SET_APPOINTMENTS_MODAL_ERROR:
            return {
                ...state,
                modalErrors: action.modalErrors
            };
        case GET_REGISTER_APPOINTMENT:
            return {
                ...state,
                loadingModal: false,
                medicalServices: action.medicalServices,
                pets: action.pets
            };
        case GET_CLIENT_APPOINTMENTS:
                return {
                    ...state,
                    loading: false,
                    appoByClient: action.appoByClient,
                    searchParams: action.searchParams
                };
        default:
            return state;
    }
}

