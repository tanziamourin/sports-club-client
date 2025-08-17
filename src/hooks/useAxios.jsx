// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: `http://localhost:5000` ,   
//   // https://sports-club-sever.vercel.app
// });

// const useAxios = () => axiosInstance;

// export default useAxios;


// src/api/axios.js (or wherever your hook is located)

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Your backend URL
  withCredentials: true, // If you need cookies/sessions
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  }
});

// Add request interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
      return Promise.reject({ message: "Network Error" });
    } else {
      // Something happened in setting up the request
      console.error("Request Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);
const useAxios = () => axiosInstance;

export default useAxios;
// export default axiosInstance;
