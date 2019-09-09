
import store from '../store';
import { GET_EMPLOYEE_SENDERS,GET_CLIENT_SENDERS,GET_COUNT_NEW_MSG, GET_ERRORS,  CLEAR_ERRORS } from './types';
// TO DO: IMPLEMENT----->>>   POST_MESSAGE,SET_SEEN, DELETE_MESSAGE,  MESSAGE_LOADING,

import { getCountNewMessage, setProcitanoMsg, getPosiljaociPoruka } from "../WebApis/requestsGraphQL.js";
    

export const getMessageSenders = searchParams => async dispatch => {

    dispatch(getCountNewMessag(searchParams.userID));
    dispatch({ type: CLEAR_ERRORS,payload: {error: false, errorMessage: ""} })
 
    await getPosiljaociPoruka(searchParams.userID,searchParams.role,  searchParams.row,searchParams.searchString, searchParams.limit)
        .then(  response => {
            if(searchParams.role==="Client" && response.length>0)
            {
                let mergedLists =[];
                if(searchParams.row>0 )
                { 
                        let currentList=  store.getState().messages.clients;
                        let newList=response;
                        let mergedLists = currentList.concat(newList);   
                        dispatch({
                            type: GET_CLIENT_SENDERS,
                            payload: mergedLists,
                            searchParams: searchParams
                        })
                }
                else
                {   
                    mergedLists=response;
                    dispatch({
                        type: GET_CLIENT_SENDERS,
                        payload: mergedLists,
                        searchParams: searchParams
                     })
                }
            }
            if(searchParams.role!=="Client" && response.length>0)
            { 
                let mergedLists =[];
                if(searchParams.row>0 && response.length>0)
                {
                        let currentList=  store.getState().messages.emplyees;
                        let newList=response;
                        let mergedLists = currentList.concat(newList);
                        dispatch({
                            type: GET_EMPLOYEE_SENDERS,
                            payload: mergedLists,
                            searchParams: searchParams
                        })
                }
                else
                {
                    mergedLists=response;
                    dispatch({
                        type: GET_EMPLOYEE_SENDERS,
                        payload: mergedLists,
                        searchParams: searchParams
                     }) 
                }

            }
        }
        )
        .catch(err => {
                     
                        dispatch({type: GET_ERRORS,payload: err })     
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
                
                    dispatch({type: GET_ERRORS,payload: err })     
    }
    );
};

export const setSeen = (senderID, userID )=> async dispatch => {
                        setProcitanoMsg(senderID, userID).then(res => {
                            dispatch(getCountNewMessag(userID));
                        }
    )
    .catch(err => {
                    dispatch({type: GET_ERRORS,payload: err })     
    }
    );
};