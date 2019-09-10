
import store from '../store';
import { GET_EMPLOYEE_SENDERS, GET_CLIENT_SENDERS, GET_COUNT_NEW_MSG, GET_MESSAGES, MESSAGE_LOADING, GET_ERRORS, CLEAR_ERRORS } from './types';
// TO DO: IMPLEMENT----->>>   ,SET_SEEN, DELETE_MESSAGE,  

import { getCountNewMessage, setProcitanoMsg, getPosiljaociPoruka, getPoruke, PostPoruke, delleteMessage } from "../WebApis/requestsGraphQL.js";


/// ZAMJENI searchParams SA sendersParams

export const getMessageSenders = searchParams => async dispatch => {

    dispatch(setMessagessLoading(true, false));
    dispatch(getCountNewMessag(searchParams.userID));
    dispatch({ type: CLEAR_ERRORS, payload: { error: false, errorMessage: "" } })

    //set search setring to array (clients/employees)
    let searchString = { "Client": store.getState().messages.searchParams.searchString["Client"], "Employee": store.getState().messages.searchParams.searchString["Employee"] };
    searchString[searchParams.role] = searchParams.searchString;
    searchParams.searchString = searchString;

    await getPosiljaociPoruka(searchParams.userID, searchParams.role, searchParams.row, searchParams.searchString[searchParams.role], searchParams.limit)
        .then(response => {

            if (searchParams.role === "Client") {

                let mergedLists = [];
                if (searchParams.searchString[searchParams.role] !== store.getState().messages.searchParams.searchString["Client"]) {
                    mergedLists = response;
                }
                else {
                    let currentList = store.getState().messages.clients;
                    let newList = response;
                    mergedLists = currentList.concat(newList);
                }

                dispatch({
                    type: GET_CLIENT_SENDERS,
                    payload: mergedLists,
                    searchParams: searchParams
                })

            }
            if (searchParams.role === "Employee") {

                let mergedLists = [];
                if (searchParams.searchString[searchParams.role] !== store.getState().messages.searchParams.searchString["Employee"]) {

                    mergedLists = response;
                }
                else {
                    let currentList = store.getState().messages.employees;
                    let newList = response;
                    mergedLists = currentList.concat(newList);
                }

                dispatch({
                    type: GET_EMPLOYEE_SENDERS,
                    payload: mergedLists,
                    searchParams: searchParams
                })
            }
        }
        )
        .catch(err => {

            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};

export const getCountNewMessag = ID => async dispatch => {
    getCountNewMessage(ID).then(coutNewMess => {

        if (coutNewMess.Osoblje === 0) coutNewMess.Osoblje = "";
        if (coutNewMess.Klijent === 0) coutNewMess.Klijent = "";

        dispatch({
            type: GET_COUNT_NEW_MSG,
            payload: coutNewMess
        })
    }
    )
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};

export const setSeen = (senderID, userID) => async dispatch => {
    setProcitanoMsg(senderID, userID).then(res => {
        dispatch(getCountNewMessag(userID));
    }
    )
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};
export const setMessagessLoading = (sendersL, messagesL) => {
    // This function will be used for loading spiner for senders and mesages load
    return {
        type: MESSAGE_LOADING,
        sendersLoading: sendersL,
        messagesLoading: messagesL
    };
};

/// ONLY MESSAGES:
export const getMessages = messagesParams => async dispatch => {

    if (messagesParams.row === 0)  // CLEAN
    {
        dispatch({
            type: GET_MESSAGES,
            messagesList: [],
            messagesParams: {}
        })
    }
    dispatch(setMessagessLoading(false, true));
    getPoruke(messagesParams.currentUserID, messagesParams.senderID, messagesParams.row)
        .then(response => {

            let messagesList = [];
            if (messagesParams.row === 0)  // FIRST CLICK ON NEW SENDER
            {
                messagesList = response.reverse();
            }
            else {
                let newMessages = response.reverse();
                messagesList = newMessages.concat(store.getState().messages.messagesList);
            }

            dispatch({
                type: GET_MESSAGES,
                messagesList: messagesList,
                messagesParams: messagesParams
            })
        }
        )
        .catch(err => {

            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};
export const addMessage = message => async dispatch => {

    dispatch(setMessagessLoading(false, true));
    PostPoruke(message).then(response => {

        let messagesList = [];
        messagesList = store.getState().messages.messagesList.concat(response);
        dispatch({
            type: GET_MESSAGES,
            messagesList: messagesList
        })
    })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: err })
        });
};
export const deleteMessage = (id, index) => async dispatch => {

    dispatch(setMessagessLoading(false, true));

    delleteMessage(id).then(response => {

        let newMessagesList = store.getState().messages.messagesList;
        newMessagesList[index].Sadrzaj = "*** deleted message ***";

        dispatch({
            type: GET_MESSAGES,
            messagesList: newMessagesList
        })
    })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};