import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Add the login token to protected API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nuzio_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle expired or invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nuzio_token");
      localStorage.removeItem("nuzio_user");
    }

    return Promise.reject(error);
  },
);

export default api;
