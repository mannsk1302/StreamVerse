import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://streamverse-xd5s.onrender.com/api/v1",
  withCredentials: true, // agar JWT/cookie based auth use kar raha hai
});

export default api;