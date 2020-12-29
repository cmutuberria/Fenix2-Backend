import {
    CHANGE_LANGUAGE_START, LOAD_LANGUAGE_START,
} from '../actionTypes'

export const change_language = payload => ({
    type: CHANGE_LANGUAGE_START,
    payload
})

export const loadLang = payload => ({
    type: LOAD_LANGUAGE_START,
    payload
})
