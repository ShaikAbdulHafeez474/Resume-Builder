import axios from "axios";
import useStore from "../store/useStore";

// Use environment variable or fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5003";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add JWT automatically to requests
api.interceptors.request.use((config) => {
  const { token } = useStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear user state
      useStore.getState().clearUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;