export const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_SERVER_URL;

export const API_BASE_URL = `${BASE_URL}/api`;
