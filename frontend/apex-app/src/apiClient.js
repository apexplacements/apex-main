import axios from "axios";

// Use explicit backend URL when provided, otherwise default to localhost during development.
const envUrl = import.meta.env.VITE_API_URL?.trim();
const isDev = !!import.meta.env.DEV;
const apiBaseUrl = envUrl || (isDev ? "http://localhost:5000" : "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
