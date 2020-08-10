import {put, call, takeLatest} from 'redux-saga/effects';
import {LOGIN_START, 
    LOGIN_COMPLETE, 
    LOGIN_ERROR,
    LOGIN_SERVER_ERROR,
    LOGOUT_START,
    LOGOUT_COMPLETE,
    LOAD_USER_BY_TOKEN_START,
    LOAD_USER_BY_TOKEN_COMPLETE,
    LOAD_USER_BY_TOKEN_ERROR
} from '../actionTypes';
import {apiCall} from '../Api';

export function* login({payload}){
    try {
        const result = yield call(apiCall,`/login`, payload, null, 'POST');
        if (result.data.success) {
            localStorage.setItem('token', result.data.token)
            yield put({type:LOGIN_COMPLETE, result});
        }else{
            localStorage.removeItem("token");
            yield put({
                type: LOGIN_ERROR,
                result
            });
        }
    } catch (error) {
        localStorage.removeItem("token");
        yield put({
            type: LOGIN_SERVER_ERROR,
            result:"ERROR DEL SERVIDOR"
        });
    }
}
export function* loadUser({payload}){
    try {
        const result = yield call(apiCall, `/checkUserAuth`, {token:payload}, null, 'POST');
        if (result.data.success) {
            yield put({type:LOAD_USER_BY_TOKEN_COMPLETE, result});
        }else{
            localStorage.removeItem("token");
            yield put({
                type: LOAD_USER_BY_TOKEN_ERROR,
                result
            });
        }
    } catch (error) {
        localStorage.removeItem("token");
        yield put({
            type: LOGIN_SERVER_ERROR,
            result:"ERROR DEL SERVIDOR"
        });
    }
}
export function* logout(){
            localStorage.removeItem("token");
            yield put({type: LOGOUT_COMPLETE});
}

export default function* auth(){
    yield takeLatest(LOGIN_START, login);
    yield takeLatest(LOAD_USER_BY_TOKEN_START, loadUser);
    yield takeLatest(LOGOUT_START, logout);
}
