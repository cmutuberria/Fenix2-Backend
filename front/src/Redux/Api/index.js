import axios from 'axios';

//const baseURL = "http://localhost:5000";

export const apiCall = (url, data, headers, method, responseType = 'json') => axios({
  method,
  url: process.env.REACT_APP_BASE_URL + url,
  data,
  headers,
  responseType
})