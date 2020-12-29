import {get} from 'lodash';

/*Common */
export const error = state => get(state, "common.error");
export const loading = state => get(state, "common.loading");
/*auth*/
export const userAuthenticated = state => get(state, "auth.userAuthenticated");
export const isAuthenticated = state => get(state, "auth.isAuthenticated");
export const token = state => get(state, "auth.token");
export const authError = state => get(state, "auth.error");
export const authLoading = state => get(state, "auth.loading");
/* lang */
export const langSelected = state => get(state, "lang.lang");

