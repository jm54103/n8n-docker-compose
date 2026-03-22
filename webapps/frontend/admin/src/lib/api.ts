import axios from "axios";

// ใน Next.js ใช้ process.env และต้องมี NEXT_PUBLIC_ นำหน้า
const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_API_URL; // กำหนดค่าเริ่มต้นถ้าไม่มี env variable

console.log("NEXT NODE_ENV", process.env.NODE_ENV);
console.log("Current API URL:", BASE_URL_API);

const api = axios.create({
  baseURL: BASE_URL_API,
});

// Interceptor: ถ้ามี Token ใน LocalStorage ให้ใส่ไปใน Header ทุกครั้ง
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const logoutApi = async () => {
  try {
    // ยิงไปที่ /auth/logout ตาม Swagger (POST)
    await api.post("/auth/logout"); 
  } finally {
    // ไม่ว่า API จะสำเร็จหรือ Error เราควรล้างเครื่องผู้ใช้เสมอ
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");   
  }
};

export default api;