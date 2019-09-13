
import store from '../store';
import { GET_EMPLOYEE_SENDERS, GET_CLIENT_SENDERS, GET_COUNT_NEW_MSG, GET_MESSAGES, MESSAGE_LOADING, GET_ERRORS, CLEAR_ERRORS } from './types';
import { getCountNewMessage, setProcitanoMsg, getPosiljaociPoruka, getPoruke, PostPoruke, delleteMessage } from "../WebApis/requestsGraphQL.js";

export const getMessageSenders = sendersParams => async dispatch => {

    dispatch(setMessagessLoading(true, false));
    dispatch(getCountNewMessag(sendersParams.userID));
    dispatch({ type: CLEAR_ERRORS, payload: { error: false, errorMessage: "" } })

    //set search setring to array (clients/employees)
    let searchString = { "Client": store.getState().messages.sendersParams.searchString["Client"], "Employee": store.getState().messages.sendersParams.searchString["Employee"] };
    searchString[sendersParams.role] = sendersParams.searchString;
    sendersParams.searchString = searchString;

    await getPosiljaociPoruka(sendersParams.userID, sendersParams.role, sendersParams.row, sendersParams.searchString[sendersParams.role], sendersParams.limit)
        .then(response => {

            if (sendersParams.role === "Client") {

                let mergedLists = [];
                if (sendersParams.searchString[sendersParams.role] !== store.getState().messages.sendersParams.searchString["Client"]) {
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
                    sendersParams: sendersParams
                })
            }
            if (sendersParams.role === "Employee") {

                let mergedLists = [];
                if (sendersParams.searchString[sendersParams.role] !== store.getState().messages.sendersParams.searchString["Employee"]) {
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
                    sendersParams: sendersParams
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