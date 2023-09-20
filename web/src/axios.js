import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://192.168.89.28:8080",
  timeout: 5000,
});

export default instance;
