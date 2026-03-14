// src/api/client.ts
import axios from 'axios';
import { AuthenticationApi, Configuration } from '../api-client';

// 1. ตั้งค่า Configuration 
const config = new Configuration({
  basePath: 'http://localhost:5000', 
  // ถ้ามี Token ให้ใส่ตรงนี้
  // accessToken: 'your_jwt_token',
});

export const apiClient = new AuthenticationApi(config);


async function runTest() {

  console.log('🚀 เริ่มต้นการทดสอบ API...');
  

  // 2. สร้าง Instance ของ API
  const api = new AuthenticationApi(config);
  try 
  {
    // 3. เรียก Method ที่ต้องการทดสอบ (ลองอันที่ง่ายที่สุด เช่น findAll หรือ getHello)    
    
    console.log('📡 กำลังเรียกข้อมูลจาก NestJS...');
    const response1 = await api.authControllerLogin({username: 'tester01', password: 'SecretPassword123'}); 
    // ปรับพารามิเตอร์ตามที่ API ต้องการ    
    console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(response1.data);     


  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    } else {
      console.error('❌ Unexpected Error:', error);
    }
  }
}

runTest();