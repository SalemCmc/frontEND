

import { GET_USERS, GET_USER, UPDATE_USER, GET_ERRORS, USERS_LOADING, CLEAR_ERRORS } from './types';
import { getUsersG } from "../WebApis/requestsGraphQL.js";
import { getUserByIDG, updateUserG } from "../WebApis/requestsGraphQL.js";


export const getUsers = searchParams => async dispatch => {

    dispatch(setUsersLoading(true));
    dispatch({
        type: CLEAR_ERRORS,
        payload: { error: false, errorMessage: "" }
    })

    await getUsersG(searchParams.searchString, searchParams.role, searchParams.active, searchParams.row, searchParams.limit)
        .then(response => {
            // console.log("RESPONSE: ", response);
            dispatch({
                type: GET_USERS,
                payload: response.items,
                count: response.count,
                searchParams: searchParams
            })
        }
        )
        .catch(err => {

            dispatch(setUsersLoading(false));
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        }
        );
};

/// get user by ID (edit profile or view details)
export const getUserByID = ID => async dispatch => {

    dispatch(setUsersLoading(true));
    dispatch({
        type: CLEAR_ERRORS,
        payload: { error: false, errorMessage: "" }
    })
    await getUserByIDG(ID)
        .then(response => {
             console.log("RESPONSE U AKCIJI: ", response);
            dispatch({
                type: GET_USER,
                payload: response
            })
        }
        )
        .catch(err => {
            dispatch(setUsersLoading(false));
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        }
        );
};
export const updateUser = user => async dispatch => {


    await updateUserG(user)
        .then(response => {
            dispatch({
                type: UPDATE_USER,
                payload: response
            })
        }
        )
        .catch(err => {
           
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        }
        );
};




export const setUsersLoading = (value) => {
    return {
        type: USERS_LOADING,
        payload: value
    };
};