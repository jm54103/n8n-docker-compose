// src/api/api.spec.ts
import { apiClient } from './test-api';

describe('API Client Integration Test', () => {
  
  it('should fetch users list from NestJS', async () => {
    try {

      const response = await apiClient.authControllerLogin({username: 'us00001', password: 'SecretPassword123'});      
      // ตรวจสอบว่า Status Code เป็น 200
      expect(response.status).toBe(200);
      
      // ตรวจสอบว่า Data ที่ได้เป็น Array (ตาม DTO ที่เราตั้งไว้)
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      // ถ้า Error ให้พ่น log ออกมาดูว่าเพราะอะไร (เช่น 404 หรือ 500)
      console.error(error.response?.data);
      throw error;
    }
  });  
});