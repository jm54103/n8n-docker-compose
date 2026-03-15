// src/api/client.ts
import axios from 'axios';
import { AuthenticationApi, Configuration } from '../api-client';
import { RefreshDto } from '../api-client/api';

// 1. ตั้งค่า Configuration 
const config = new Configuration({
  basePath: 'http://localhost:5000', 
  // ถ้ามี Token ให้ใส่ตรงนี้
  accessToken: 'your_jwt_token', 
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
    
    console.log('📡 1.ทดสอบ Login & Logout');
    const responseLogin1 = await api.authControllerLogin({username: 'tester01', password: 'SecretPassword123'});     
    //console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseLogin1.data);     
    config.accessToken = responseLogin1.data['accessToken']; // อัปเดต Token ใน Configuration หลังจาก Login สำเร็จ
    const responseLogout = await api.authControllerLogout(); 
    console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseLogout.data);     

    console.log('📡 2.ทดสอบ Login & LogoutAll');
    const responseLogin2 = await api.authControllerLogin({username: 'tester01', password: 'SecretPassword123'});     
    //console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseLogin2.data);     
    config.accessToken = responseLogin2.data['accessToken']; // อัปเดต Token ใน Configuration หลังจาก Login สำเร็จ
    const responseLogoutAll = await api.authControllerLogoutAll(); 
    console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseLogout.data); 
    

    console.log('📡 3.ทดสอบ Login & Refresh');
    const responseLoginRefresh = await api.authControllerLogin({username: 'tester01', password: 'SecretPassword123'});     
    //console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseLoginRefresh.data);     
    config.accessToken = responseLoginRefresh.data['accessToken']; // อัปเดต Token ใน Configuration หลังจาก Login สำเร็จ
    const refreshDto : RefreshDto = {   refreshToken:''};     
    refreshDto.refreshToken = responseLoginRefresh.data['refreshToken']; // อัปเดต Refresh Token ใน Configuration หลังจาก Login สำเร็จ
    const responseRefreshToken = await api.authControllerRefresh(refreshDto);   
    console.log('✅ สำเร็จ! ข้อมูลที่ได้รับ:');
    console.table(responseRefreshToken.data); 


  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    } else {
      console.error('❌ Unexpected Error:', error);
    }
  }
}

runTest();