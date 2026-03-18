import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5010",
  withCredentials: true, // send cookies cross-origin
});

export default axiosPublic;
