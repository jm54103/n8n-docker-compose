import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // เปลี่ยนเป็น URL ของ NestJS คุณ
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
    window.location.href = "/login"; // เด้งกลับหน้า Login
  }
};

export default api;