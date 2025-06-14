import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.log("Internal server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout. Please try again later.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
