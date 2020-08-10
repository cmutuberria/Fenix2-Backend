import {
    LOADING_START,
    LOADING_END,
    SERVER_ERROR,
    
} from '../actionTypes'

const initialState = {
    loading:false,
    error:null,
};
export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_START:
            return {
                ...state,
                loading: true,
                msgSnack: null,

            };
        case LOADING_END:
            return {
                ...state,
                loading: false,
                msgSnack: null,

            };
        case SERVER_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return {
                ...state
            }
    }

}