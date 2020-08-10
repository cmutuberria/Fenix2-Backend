import {combineReducers} from 'redux';
import auth from './auth';
import common from './common';

const rootReducers= combineReducers({
    auth,
    common
});

export default rootReducers;