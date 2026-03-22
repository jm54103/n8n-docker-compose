import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JWTPayload, RefreshResponse } from "./jwt.util";

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

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

const executeRefreshToken = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await axios.post<RefreshResponse>(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = res.data;

    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

    console.log("Token refreshed successfully (GMT+7)");
    
    // วน Loop ตั้งเวลาใหม่สำหรับ Token ใบปัจจุบัน
    setupSilentRefresh();
  } catch (error) {
    console.error("Silent refresh execution failed:", error);
    logoutApi(); 
  }
};

export const setupSilentRefresh = (): void => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("accessToken");
  if (!token) return;

  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    
    // ตั้งเป้าหมายรีเฟรชก่อนหมดจริง 15 วินาที
    const bufferSeconds = 15;
    const delayInMs = (exp - now - bufferSeconds) * 1000;

    if (refreshTimeout) clearTimeout(refreshTimeout);

    if (delayInMs > 0) {
      // แสดงเวลาที่จะ Refresh เป็น GMT+7 ใน Console เพื่อ Debug
      const refreshDate = new Date(Date.now() + delayInMs).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });
      console.log(`[Auth] Next refresh scheduled at: ${refreshDate}`);

      refreshTimeout = setTimeout(async () => {
        await executeRefreshToken();
      }, delayInMs);
    } else {
      // หากเหลือน้อยกว่า 60 วิ ให้รีเฟรชทันที
      executeRefreshToken();
    }
  } catch (error) {
    console.error("Failed to decode token for refresh:", error);
  }
};

export default api;