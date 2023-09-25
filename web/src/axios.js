import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://192.168.89.28:8080",
  headers: { "login-token": user?.token, "Content-Type": "application/json" },
  responseType: "json",
});

export default instance;
