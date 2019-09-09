
import { GET_PETS,UPDATE_PET,PETS_LOADING} from '../actions/types';

const initialState = {
    items: [],
    count: 0,
    petUpdate:{},
    searchParams: {},
    loading: false

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_PETS:
            return {
                ...state,
                items: action.payload,
                count: action.count,
                searchParams: action.searchParams,
                loading: false
            };
        case UPDATE_PET:
                return {
                    ...state,
                    petUpdate: action.payload,
                    loading: false
                };
        case PETS_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
}

