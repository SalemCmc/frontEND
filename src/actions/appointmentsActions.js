

import store from '../store';
import { GET_DOCTOR_APPOINTMENTS, APPOINTMENTS_LOADING, SET_APPOINTMENTS_ADD_SUCCESS, GET_ERRORS, CLEAR_ERRORS } from './types';
import { getTerminiByDoktor, ukloniTermin, PostTermin, evidentirajTermin } from "../WebApis/requestsGraphQL.js";

export const getAppointmentsByDoctor = appoParams => async dispatch => {
    
    dispatch(setAppointmentsLoading(true));
    let newDate = new Date(appoParams.date);
    let newDate2 = new Date(appoParams.date);
    let pWeek = new Date(newDate.setDate(newDate.getDate() - 7));
    let ntWeek = new Date(newDate.setDate(newDate2.getDate() + 7));
    let prevWeek = pWeek.getFullYear() + "-" + (pWeek.getMonth() + 1) + "-" + pWeek.getDate();
    let nextWeek = ntWeek.getFullYear() + "-" + (ntWeek.getMonth() + 1) + "-" + ntWeek.getDate();
    let currentappoByDoctorList = store.getState().appointments.appoByDoctorList;
   
   
    // 0. if update after add new element
   if (appoParams.weekAction === "update") 
   {
    currentappoByDoctorList[1] = await getAppointmentsFromAPI(appoParams.doctorID, appoParams.date);
    dispatch({
        type: GET_DOCTOR_APPOINTMENTS,
        appoByDoctorList: currentappoByDoctorList,
        appoParams: appoParams
    })
   }
   
    //1.     CASE 1: get current week (initial)

    if (appoParams.weekAction === null) {
      
        currentappoByDoctorList[1] = await getAppointmentsFromAPI(appoParams.doctorID, appoParams.date);
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
        })
        // SET BUFFER (first and last element)
        currentappoByDoctorList[0] = await getAppointmentsFromAPI(appoParams.doctorID, prevWeek);
        currentappoByDoctorList[2] = await getAppointmentsFromAPI(appoParams.doctorID, nextWeek);
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
        })
    }
    //2.     CASE 2: get next week (set buffer for other weeks)
    if (appoParams.weekAction === "next") {
                if(currentappoByDoctorList.length<3)
                {// waith for code below
                    return;
                }

        currentappoByDoctorList.shift();
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
        })
        currentappoByDoctorList[2] = await getAppointmentsFromAPI(appoParams.doctorID, nextWeek);
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
        })
    }
    if (appoParams.weekAction === "previous") {
        if(currentappoByDoctorList.length>3)
        {  // waith!
            return;
        }
        currentappoByDoctorList.unshift([]);
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
        })
        currentappoByDoctorList[0] = await getAppointmentsFromAPI(appoParams.doctorID, prevWeek);
        currentappoByDoctorList.pop();
        dispatch({
            type: GET_DOCTOR_APPOINTMENTS,
            appoByDoctorList: currentappoByDoctorList,
            appoParams: appoParams
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
            let params = await store.getState().appointments.appoParams;
            params.weekAction="update";
            dispatch(getAppointmentsByDoctor(params));
        }
        else {
            //LOAD CLIENTS TERMINS! LATER
        }
    }
    )
        .catch(err => {

            dispatch({ type: GET_ERRORS, payload: err.message.toString() })
        }
        );
};


export const removeAppointment = (ID, type) => async dispatch => {

    ukloniTermin(ID).then(response => {

        if (type === "Doctor") {
            dispatch(removeDoctorsAppointments(ID));
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
    return { type: GET_DOCTOR_APPOINTMENTS, appoByDoctorList: appointments };
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

            dispatch({ type: GET_ERRORS, payload: err.message.toString() })
        }
        );
};