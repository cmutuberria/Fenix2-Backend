import {
    LOGIN_START,
    LOGIN_COMPLETE,
    LOGIN_ERROR,
    LOGIN_SERVER_ERROR,
    LOGOUT_COMPLETE,
    LOAD_USER_BY_TOKEN_START,
    LOAD_USER_BY_TOKEN_COMPLETE,
    LOAD_USER_BY_TOKEN_ERROR
} from '../actionTypes'

const initialState = {
    error: null,
    token: "",
    userAuthenticated: null,
    isAuthenticated: false,
    loading: false
};
export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_USER_BY_TOKEN_START:
            return {
                ...state,
                error: null,
                    isAuthenticated: false,
                    loading: true,
            };
            break;
        case LOAD_USER_BY_TOKEN_COMPLETE:
            return {
                ...state,
                loading: false,
                    error: null,
                    token: action.result.data.token,
                    userAuthenticated: action.result.data.userAuthenticated,
                    isAuthenticated: true,
            };
            break;
        case LOAD_USER_BY_TOKEN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                    loading: false,
                    token: "",
                    userAuthenticated: null,
                    error: action.result.data.message,
            };
            break;
        case LOGIN_START:
            return {
                ...state,
                error: null,
                    token: "",
                    userAuthenticated: null,
                    isAuthenticated: false,
                    loading: true,
            };
            break;
        case LOGIN_COMPLETE:
            return {
                ...state,
                loading: false,
                    error: null,
                    token: action.result.data.token,
                    userAuthenticated: action.result.data.userAuthenticated,
                    isAuthenticated: true,
            };
            break;
        case LOGIN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                    loading: false,
                    token: "",
                    userAuthenticated: null,
                    error: action.result.data.message,
            };
            break;
        case LOGIN_SERVER_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                    loading: false,
                    token: "",
                    userAuthenticated: null,
                    error: action.result,
            };
            break;
        case LOGOUT_COMPLETE:
            return {
                ...state,
                isAuthenticated: false,
                    loading: false,
                    token: "",
                    userAuthenticated: null,
                    error: null,
            };
            break;
        default:
            return {
                ...state
            }
            break;
    }

}