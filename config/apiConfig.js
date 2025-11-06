// api.js
import axios from 'axios';
import { BASE_URL } from '../config/appConfig';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 errors globally
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Authentication failed, redirecting to login.");
      // You might need to dispatch a logout action here too
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;