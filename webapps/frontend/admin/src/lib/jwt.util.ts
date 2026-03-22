import { jwtDecode } from "jwt-decode";

export const getSafeDecodedToken = () => {
  // 1. เช็คว่าอยู่ใน Browser หรือไม่ (ป้องกัน Next.js Server-side error)
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // 2. ฟังก์ชันแปลง Unix Timestamp เป็น Date Object
    // ต้องคูณ 1000 เพราะ JWT ใช้ seconds แต่ JS ใช้ ms
    const convertToDate = (unixTimestamp:any) => {
      return unixTimestamp ? new Date(unixTimestamp * 1000) : null;
    };

    const expDate = convertToDate(decoded.exp);
    const iatDate = convertToDate(decoded.iat);

    return {
      ...decoded,
      // 3. แสดงผลเป็น String ในรูปแบบ GMT+7 (Asia/Bangkok)
      loginTime: iatDate?.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      expiryTime: expDate?.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      // ส่ง Date object กลับไปด้วยเผื่อเอาไปคำนวณต่อ
      rawExp: expDate, 
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export interface JWTPayload {
  exp: number; // Expiration time (seconds)
  iat: number; // Issued at (seconds)
  sub?: string;
  role?: string;
  [key: string]: any; // สำหรับ custom claims อื่นๆ
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}





