// src/api/api.mock.spec.ts
import { apiClient } from './client';

// Mock axios ที่อยู่ข้างใน api-client
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client Unit Test (Mocked)', () => {
  it('should return mocked data', async () => {
    const mockData = [{ id: 1, name: 'Mock User' }];    
    // จำลองค่าที่ axios จะคืนกลับมา
    mockedAxios.get.mockResolvedValue({ data: mockData, status: 200 });
    const response = await apiClient.authControllerLogin({username: 'us00001', password: 'SecretPassword123'});
    expect(response.data).toEqual(mockData);
  });
});