import {
    LOGIN_START,
    LOGOUT_START,
    LOAD_USER_BY_TOKEN_START
} from '../actionTypes'

export const login = payload => ({
    type: LOGIN_START,
    payload
})

export const logout = payload => {
    return({
    type: LOGOUT_START,
    payload
})}

export const loadUserByToken = payload => ({
    type: LOAD_USER_BY_TOKEN_START,
    payload
})
