import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "localhost:8080/api/v1/users",
  withCredentials: true,
});
export default axiosInstance;
