import {all} from "redux-saga/effects";
import auth from "./auth";
import lang from './lang';

export default function* rootSaga() {
    yield all([
         auth(),
         lang(),
    ]);
}