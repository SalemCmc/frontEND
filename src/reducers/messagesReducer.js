
import { GET_EMPLOYEE_SENDERS, GET_CLIENT_SENDERS,GET_MESSAGES, GET_COUNT_NEW_MSG, MESSAGE_LOADING } from '../actions/types';

const initialState = {
    //SENDERS:
                    clients: [],
                    employees: [],
                    searchParams: {searchString: { "Client": "", "Employee": "" }},
                    countNewMessages: {},
                    sendersLoading: false,
    //MESSAGES
                    messagesList: [],
                    messagesParams: {"currentUserID":null, "senderID":null, "row":0},
                    messagesLoading: false

};

export default function (state = initialState, action) {

    switch (action.type) {
        case GET_CLIENT_SENDERS:
            return {
                ...state,
                clients: action.payload,
                searchParams: action.searchParams,
                sendersLoading: false,
                messagesLoading:false

            };
        case GET_EMPLOYEE_SENDERS:
            return {
                ...state,
                employees: action.payload,
                searchParams: action.searchParams,
                sendersLoading: false,
                messagesLoading:false
            };
        case GET_COUNT_NEW_MSG:
            return {
                ...state,
                countNewMessages: action.payload
            };
        case GET_MESSAGES:
                return {
                    ...state,
                    messagesList: action.messagesList,
                    messagesLoading:false
            };
        case MESSAGE_LOADING:
            return {
                ...state,
                sendersLoading: action.sendersLoading,
                messagesLoading:action.messagesLoading
            };
        default:
            return state;
    }
}

