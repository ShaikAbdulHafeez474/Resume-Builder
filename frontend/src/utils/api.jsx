
import axios from "axios";
import useStore from "../store/useStore";

const api = axios.create({
  baseURL: "http://localhost:5000", // 👈 change this to API Gateway URL later
});

// Add JWT automatically
api.interceptors.request.use((config) => {
  const { token } = useStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
