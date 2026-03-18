import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5010",
  withCredentials: true,
});

export default axiosPrivate;
