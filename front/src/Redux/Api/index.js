import axios from 'axios';

const baseURL = "http://localhost:5000";

export const apiCall = (url, data, headers, method, responseType = 'json') => axios({
  method,
  url: baseURL + url,
  data,
  headers,
  responseType
})