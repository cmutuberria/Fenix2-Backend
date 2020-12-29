import {
    CHANGE_LANGUAGE_COMPLETE,
    LOAD_LANGUAGE_COMPLETE
} from '../actionTypes'

const initialState = {
    lang: "es"
};
export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE_COMPLETE:
            return {
                ...state,
               lang:action.payload
            };
            break;   
        case LOAD_LANGUAGE_COMPLETE:
            console.log("payload ",action.payload);
            return {
                ...state,
               lang:action.payload
            };
            break;        
        default:
            return {
                ...state
            }
            break;
    }

}