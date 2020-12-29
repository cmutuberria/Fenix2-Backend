import {put, call, takeLatest} from 'redux-saga/effects';
import {CHANGE_LANGUAGE_START,
    CHANGE_LANGUAGE_COMPLETE,
    CHANGE_LANGUAGE_ERROR,
    LOAD_LANGUAGE_START,
    LOAD_LANGUAGE_COMPLETE,
    LOAD_LANGUAGE_ERROR
} from '../actionTypes';

export function* change_language({payload}){
    try {
            localStorage.setItem('lang', payload)
            yield put({type:CHANGE_LANGUAGE_COMPLETE, payload});
    } catch (error) {
        localStorage.removeItem("lang");
        yield put({
            type: CHANGE_LANGUAGE_ERROR,
            result:"ERROR CAMBIANDO LENGUAJE"
        });
    }
}

export function* load_language({payload}){
    try {
            yield put({type:LOAD_LANGUAGE_COMPLETE, payload});
    } catch (error) {
        yield put({
            type: LOAD_LANGUAGE_ERROR,
            result:"ERROR CAMBIANDO LENGUAJE"
        });
    }
}
export default function* lang(){
    yield takeLatest(CHANGE_LANGUAGE_START, change_language);
    yield takeLatest(LOAD_LANGUAGE_START, load_language);
    
}
