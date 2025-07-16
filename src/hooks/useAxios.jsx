import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://sports-club-sever.vercel.app`,
});

const useAxios = () => axiosInstance;

export default useAxios;
