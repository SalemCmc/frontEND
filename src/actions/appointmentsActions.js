

import store from '../store';
import { GET_DOCTOR_APPOINTMENTS, GET_CLIENT_APPOINTMENTS, APPOINTMENTS_LOADING, APPOINTMENTS_MODAL_LOADING, GET_DETAILS_APPOINTMENT, GET_REGISTER_APPOINTMENT, SET_APPOINTMENTS_MODAL_ERROR, SET_APPOINTMENTS_ADD_SUCCESS, GET_ERRORS, CLEAR_ERRORS } from './types';
import { getTerminiByDoktor, getTerminiByKlijent, ukloniTermin, PostTermin, evidentirajTermin, getTerminDetails, getCommonApi, getPacijentiByVlasnikShort } from "../WebApis/requestsGraphQL.js";


function formatDate(dt)  // IN JS something is totaly wrong with date format, this function is mandatory!!!
{
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

export const getAppointmentsByClient = (searchParams) => async dispatch => {
    let clientID = store.getState().auth.user.id;
    dispatch(setAppointmentsLoading(true));
    getTerminiByKlijent(clientID, searchParams.row.toString(), searchParams.limit.toString())
        .then(response => {
            console.log("TERMINI akcija:", response);
            dispatch({
                type: GET_CLIENT_APPOINTMENTS,
                appoByClient: response,
                searchParams: searchParams
            })

        }
        )
        .catch(err => { dispatch({ type: GET_ERRORS, payload: err.message.toString() }) });


}

export const getAppointmentsByDoctor = weekAction => async dispatch => {

    dispatch(setAppointmentsLoading(true));
    let currentappoByDoctorList = store.getState().appointments.appoByDoctorList;
    let currentMonday = new Date(store.getState().appointments.currentWeek);
    let doctorID = store.getState().auth.user.id;


    //1.     CASE 1: get current week (initial)
    if (weekAction === null) {

        currentappoByDoctorList[1] = await getAppointmentsFromAPI(doctorID, formatDate(currentMonday));
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currentMonday
        })

        let pWeek = new Date(currentMonday);
        let previousMonday = new Date(pWeek.setDate(pWeek.getDate() - 7));
        let nWeek = new Date(currentMonday);
        let nextMonday = new Date(nWeek.setDate(nWeek.getDate() + 7));

        // SET BUFFER (get previuos and next week)
        currentappoByDoctorList[0] = await getAppointmentsFromAPI(doctorID, formatDate(previousMonday));
        currentappoByDoctorList[2] = await getAppointmentsFromAPI(doctorID, formatDate(nextMonday));
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currentMonday
        })
    }

    //2.     CASE 2: get next week (set buffer for other weeks)
    if (weekAction === "next") {

        if (currentappoByDoctorList.length < 3) // IF array is not full waith.
        {
            return;
        }

        currentappoByDoctorList.shift();// remove first element form array  

        let cWeek = new Date(currentMonday);
        let currMonday = new Date(cWeek.setDate(cWeek.getDate() + 7));
        let nWeek = new Date(currentMonday);
        let nextMonday = new Date(nWeek.setDate(nWeek.getDate() + 14));

        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currMonday
        })

        currentappoByDoctorList.push(await getAppointmentsFromAPI(doctorID, formatDate(nextMonday)));
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currMonday
        })

    }
    if (weekAction === "previous") {
        if (currentappoByDoctorList.length > 3) {  // waith!
            return;
        }
        currentappoByDoctorList.unshift([]);
        let cWeek = new Date(currentMonday);
        let currMonday = new Date(cWeek.setDate(cWeek.getDate() - 7));
        let pWeek = new Date(currentMonday);
        let previousMonday = new Date(pWeek.setDate(pWeek.getDate() - 14));

        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currMonday
        })

        currentappoByDoctorList[0] = await getAppointmentsFromAPI(doctorID, formatDate(previousMonday));
        currentappoByDoctorList.pop();
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currMonday
        })
    }
    // 0. if update after add new element
    if (weekAction === "update") {
        // TO DO: check if inserting date == date from curent week and update.
        currentappoByDoctorList[1] = await getAppointmentsFromAPI(doctorID, formatDate(currentMonday));
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            currentWeek: currentMonday
        })
    }

};
export const getAppointmentsFromAPI = (doctorID, date) => {
    return getTerminiByDoktor(doctorID, date).then(response => {
        return response;
    }
    )
        .catch(err => { return []; });
}
export const addAppointment = (newAppointment, type) => async dispatch => {


    PostTermin(newAppointment).then(async response => {

        if (type === "Doctor") {
            dispatch(setAppointmentsAddSuccess(true));
            // PREPRAVITI DA ADD API VRACA OBJEKAT I NJEGA SAMO INSERTOVATI U LISTU! bez ponovnog poziva APIJA

            dispatch(getAppointmentsByDoctor("update"));
        }
        else {
            //LOAD CLIENTS TERMINS! LATER
            dispatch(setAppointmentsAddSuccess(true));
            let params = store.getState().appointments.searchParams;
            dispatch(getAppointmentsByClient(params));  // RELOAD
        }
    }
    )
        .catch(err => {

            dispatch({ type: GET_ERRORS, payload: err.message.toString() })
        }
        );
};
export const removeAppointment = (ID, type) => async dispatch => {

    console.log("UKLON ID:", ID);
    ukloniTermin(ID).then(response => {
        console.log("UKLON resp:", response);
        if (type === "Doctor") {
            dispatch(removeDoctorsAppointments(ID));
        }
        else {
            let params = store.getState().appointments.searchParams;
            dispatch(getAppointmentsByClient(params));  // RELOAD
        }
    }
    )
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: err.message.toString() })
        }
        );
};
export const setAppointmentsLoading = (value) => {
    // This function will be used for loading spiner for senders and mesages load
    return {
        type: APPOINTMENTS_LOADING,
        loading: value
    };
};
export const setAppointmentsAddSuccess = (value) => dispatch => {
    dispatch({ type: CLEAR_ERRORS, payload: { error: false, errorMessage: "" } })
    dispatch({ type: SET_APPOINTMENTS_ADD_SUCCESS, succesPost: value });
};
export const removeDoctorsAppointments = (ID) => {
    // Remove item from store list without call web API!
    let rowIndex, cellIndex = 0;
    let appointments = store.getState().appointments.appoByDoctorList;
    appointments[1].map((item, index) => {
        item.map((cell, index2) => {
            if (cell._id === ID) {
                rowIndex = index;
                cellIndex = index2
            } return null;
        })
        return null;
    })
    appointments[1][rowIndex][cellIndex] = { _id: null, Datum: null, Vlasnik: null, VlasnikID: null, Vrijeme: null, Obavljen: null };
    return { type: GET_DOCTOR_APPOINTMENTS, appoByDoctorList: appointments, currentWeek: store.getState().appointments.currentWeek };
};
export const registerAppointment = (appointment) => async dispatch => {


    evidentirajTermin(appointment).then(response => {

        let rowIndex, cellIndex = 0;
        let appointments = store.getState().appointments.appoByDoctorList;
        appointments[1].map((item, index) => {
            item.map((cell, index2) => {
                if (cell._id === appointment.TerminID) {
                    rowIndex = index;
                    cellIndex = index2;
                } return null;
            })
            return null;
        })
        appointments[1][rowIndex][cellIndex].Obavljen = true;
        dispatch({ type: GET_DOCTOR_APPOINTMENTS, appoByDoctorList: appointments });
        dispatch(setAppointmentsAddSuccess(true));

    }
    )
        .catch(err => {
            dispatch({ type: SET_APPOINTMENTS_MODAL_ERROR, modalErrors: { error: true, errorMessage: err.message.toString() } });
            // dispatch({ type: GET_ERRORS, payload: err.message.toString() })
        }
        );
};

/// MODALS ON Appo PANEL:
export const handleAppointmentsModal = (type, appoID, ClientID) => dispatch => {


    dispatch({ type: SET_APPOINTMENTS_MODAL_ERROR, modalErrors: { error: false, errorMessage: "" } });
    dispatch({ type: APPOINTMENTS_MODAL_LOADING, load: true });

    // DETAILS  (get all data and set in reducer , and show it  in component)
    if (type === "DETAILS") {
        getTerminDetails(appoID)
            .then(resp => {

                dispatch({ type: GET_DETAILS_APPOINTMENT, appoDetails: resp });
            })
            .catch(err => {
                dispatch({ type: SET_APPOINTMENTS_MODAL_ERROR, modalErrors: { error: true, errorMessage: err.message.toString() } });
            });
    }

    if (type === "REGISTER") {

        getPacijentiByVlasnikShort(ClientID).then(pets => {

            let medicalServices = store.getState().appointments.medicalServices;

            if (medicalServices.length < 1) {
                getCommonApi("Usluge").then(services => {

                    dispatch({ type: GET_REGISTER_APPOINTMENT, medicalServices: services, pets: pets });
                })
                    .catch(err => { dispatch({ type: SET_APPOINTMENTS_MODAL_ERROR, modalErrors: { error: true, errorMessage: err.message.toString() } }); });
            }
            else {
                dispatch({ type: GET_REGISTER_APPOINTMENT, medicalServices: medicalServices, pets: pets });
            }
        })
            .catch(err => { dispatch({ type: SET_APPOINTMENTS_MODAL_ERROR, modalErrors: { error: true, errorMessage: err.message.toString() } }); });
    }

};