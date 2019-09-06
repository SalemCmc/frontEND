


import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    error: false,
    errorMessage: ""
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                error: true,
                errorMessage: action.payload
            };
        case CLEAR_ERRORS:
            return {

                error: false,
                errorMessage: ""
            };
        default:
            return state;
    }
}
