import axios from "axios";
import { isAuthenticated, isAuthenticatedAccess } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1102";

const axiosInstance = axios.create({
  baseURL: baseURL + "/api/v2/user",
  // withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = isAuthenticated();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const access = isAuthenticatedAccess();
  if (access?.token) {
    config.headers["x-access-token"] = access.token;
  }
  return config;
});

export default axiosInstance;
