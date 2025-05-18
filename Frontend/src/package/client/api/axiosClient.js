import { getCookie } from "../utils";
import axios from "axios";

const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

const axiosClient = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${getCookie("jwt")}`
  }
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
