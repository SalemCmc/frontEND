


import store from '../store';
import { GET_NOTIFICATIONS, RESET_NOTIFICATION_SEARCH, NOTIFICATION_LOADING, GET_ERRORS, CLEAR_ERRORS } from './types';

import { getObavjestiGR, deleteObavjest, addObavjest } from "../WebApis/requestsGraphQL.js";

export const getNotifications = searchParams => async dispatch => {

    dispatch(setNotificationLoading(true));
    dispatch({
        type: CLEAR_ERRORS,
        payload: {error: false, errorMessage: ""}
    })

    await getObavjestiGR(searchParams.searchString, searchParams.searchDate, searchParams.row, searchParams.limit)
        .then(response => {
            
            dispatch({
                type: GET_NOTIFICATIONS,
                payload: response.items,
                count: response.count,
                searchParams: searchParams
            })
        }
        )
        .catch(err => {

            dispatch(setNotificationLoading(false));
            dispatch({
                type: GET_ERRORS,
                payload: err
            })

        }
        );

};

export const deleteNotification = ID => async dispatch => {

    await deleteObavjest(ID);
    dispatch(getNotifications(store.getState().notifications.searchParams));
};
export const addNotification = newNotification => async dispatch => {

    await addObavjest(newNotification);
    
    dispatch(resetSearch());
    dispatch(getNotifications({ searchString: "", searchDate: "", row: 0, limit: 4, pageNumber: 1 }));
};
export const resetSearch = () => async dispatch => {

    dispatch({
        type: RESET_NOTIFICATION_SEARCH,
        searchParams: { searchString: "", searchDate: "", row: 0, limit: 4, pageNumber: 1 }
    })
};
export const setNotificationLoading = (value) => {
    return {
        type: NOTIFICATION_LOADING,
        payload: value
    };
};