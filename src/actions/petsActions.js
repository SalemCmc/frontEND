
import store from '../store';
import { GET_PETS,UPDATE_PET,PETS_LOADING, GET_ERRORS,  CLEAR_ERRORS } from './types';
import { getPetByOwnerID,postPet, deactivatePetG } from "../WebApis/requestsGraphQL.js";

export const getPetsByUserID = searchParams => async dispatch => {

    dispatch(setPetsLoading(true));
    dispatch({ type: CLEAR_ERRORS,payload: {error: false, errorMessage: ""} })
   
    await getPetByOwnerID(searchParams.userID,  searchParams.row, searchParams.limit)
        .then(response => {
            dispatch({
                        type: GET_PETS,
                        payload: response.items,
                        count: response.count,
                        searchParams: searchParams
            })
        }
        )
        .catch(err => {
                        dispatch(setPetsLoading(false));
                        dispatch({type: GET_ERRORS,payload: err })     
        }
        );
};

export const addNewPet = pet => async dispatch => {
                dispatch({ type: CLEAR_ERRORS,payload: {error: false, errorMessage: ""} })
                await postPet(pet)
                    .then(response => {
                        console.log("SAVE pets: ", response);
                        dispatch({ type: UPDATE_PET, payload: response})
                        dispatch(getPetsByUserID(store.getState().pets.searchParams));     
                    }
                    )
                    .catch(err => {
                                    dispatch(setPetsLoading(false));
                                    dispatch({type: GET_ERRORS,payload: err })     
                    }
                    );
};

export const deactivatePet = ID => async dispatch => {
    dispatch(setPetsLoading(true));
    dispatch({ type: CLEAR_ERRORS,payload: {error: false, errorMessage: ""} })

    await deactivatePetG(ID)
        .then(response => {
            dispatch(getPetsByUserID(store.getState().pets.searchParams)); 
        }
        )
        .catch(err => {
                        dispatch(setPetsLoading(false));
                        dispatch({type: GET_ERRORS,payload: err })     
        }
        );

};

export const setPetsLoading = (value) => {
    return {
        type: PETS_LOADING,
        payload: value
    };
};