

import { GET_USERS_SHORT, GET_USERS, GET_USER, UPDATE_USER, GET_ERRORS, USERS_LOADING, CLEAR_ERRORS, GET_OUR_TEAM, TEAM_LOADING } from './types';

import { getUserByIDG, getUsersG, updateUserG, getKorisniciShort } from "../WebApis/requestsGraphQL.js";

export const getUsersShort = (searcString, type) => dispatch => {

    dispatch(setUsersLoading(true));
    dispatch({ type: CLEAR_ERRORS, payload: { error: false, errorMessage: "" } })


    getKorisniciShort(searcString, type)
        .then(response => {

            dispatch({
                type: GET_USERS_SHORT,
                usersShortList: response,
            })
        }
        )
        .catch(err => {
            dispatch(setUsersLoading(false));
            dispatch({ type: GET_ERRORS, payload: err })
        }
        );
};
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
export const getOurTeam = () => async dispatch => {

         dispatch(setOurTeamLoading(true));
        dispatch({
            type: CLEAR_ERRORS,
            payload: { error: false, errorMessage: "" }
        })
     
    await getUsersG("", "Doctor", true, 0, 100)
        .then(response => {

            dispatch({
                type: GET_OUR_TEAM,
                ourTeam: response.items,
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

export const setOurTeamLoading = (value) => {
    return {
        type: TEAM_LOADING,
        payload: value
    };
};