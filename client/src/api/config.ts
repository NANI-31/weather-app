export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://weather-app-server-3dt5.onrender.com";

export const API_BASE_URL = `${BASE_URL}/api`;
