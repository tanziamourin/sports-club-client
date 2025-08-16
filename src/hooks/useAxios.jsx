import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:5000` ,   
  // https://sports-club-sever.vercel.app
});

const useAxios = () => axiosInstance;

export default useAxios;
