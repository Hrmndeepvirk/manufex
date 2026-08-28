import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1102";

const visitorApi = axios.create({
  baseURL: baseURL + "/api/v2/visitor",
});

export default visitorApi;
