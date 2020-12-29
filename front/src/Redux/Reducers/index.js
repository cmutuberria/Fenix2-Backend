import {combineReducers} from 'redux';
import auth from './auth';
import common from './common';
import lang from './lang';

const rootReducers= combineReducers({
    lang,
    auth,
    common
});

export default rootReducers;