import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxios = () => axiosInstance;

export default useAxios;
