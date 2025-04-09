// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://mentor-connect-5.onrender.com", // UPDATED
});

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    const { auth_token } = JSON.parse(authData);
    if (auth_token) {
      req.headers.Authorization = `Bearer ${auth_token}`;
    }
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;
