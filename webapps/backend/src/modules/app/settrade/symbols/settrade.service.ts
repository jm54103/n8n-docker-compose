import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // 👈 เอา HttpService ออกจากตรงนี้
import { HttpService } from '@nestjs/axios'; // 👈 นำเข้า HttpService จากที่นี่แทน
import { AxiosResponse } from 'axios'; // 👈 นำเข้า AxiosResponse เพื่อระบุ Type
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class SettradeService {
  private readonly baseUrl = 'https://open-api.settrade.com/api'; 
  private readonly appId = 'gH4B2JCzg2WG2MCU';//'YOUR_SANDBOX_APP_ID';
  private readonly appSecret = 'fntXGC4QfhYLSvtIcUQB9K211LqxSYL18ww7r2etdiI=';//'YOUR_SANDBOX_APP_SECRET';
  private readonly appCode = 'SANDBOX';
  private readonly brokerId = 'SANDBOX';

  constructor(private readonly httpService: HttpService) {}

  private generateSignature(timestamp: number): string {
    const message = `${timestamp}${this.appId}`;
    return crypto
      .createHmac('sha256', this.appSecret)
      .update(message)
      .digest('hex');
  }

  async getAccessToken(): Promise<string> {
    // SETTRADE บางเวอร์ชันใช้วินาที บางเวอร์ชันใชมิลลิวินาที 
    // ทดลองใช้ Date.now() ปกติก่อน หากยังไม่ได้ ลองเปลี่ยนเป็น Math.floor(Date.now() / 1000)
    const timestamp = Date.now(); 
    
    const message = `${timestamp}${this.appId}`;
    const signature = crypto
      .createHmac('sha256', this.appSecret)
      .update(message)
      .digest('hex');

    // ตรวจสอบให้แน่ใจว่าค่าทุกตัวไม่มี undefined หรือ string ว่าง
    const payload = {
      appId: this.appId,
      timestamp: timestamp,
      signature: signature,
      appCode: 'SANDBOX',  // ใส่เป็น string ตรงๆ ป้องกันค่าหลุด
      brokerId: 'SANDBOX', // ใส่เป็น string ตรงๆ ป้องกันค่าหลุด
    };

    try {
      // ทดลองยิงดูลักษณะของ POST แบบดั้งเดิม
      const response = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.post(`${this.baseUrl}/v2/oauth/token`, payload)
      );
      
      return response.data?.access_token;
    } catch (error) {
      // ... ดัก error เหมือนเดิม
    }
  }



  // เพิ่ม Method นี้เข้าไปในคลาส SettradeService ของคุณ
  async getAllSymbols(): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      // เรียก Endpoint ดึงรายชื่อผลิตภัณฑ์ทั้งหมดในตลาด Equity
      const response = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.baseUrl}/v2/market/equity/products`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-App-Code': this.appCode,
          },
        })
      );
      
      // ผลลัพธ์ที่ได้มักจะเป็น List ของ Object หุ้นทั้งหมด
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get all symbols: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSymbolQuote(symbol: string): Promise<any> {

    const accessToken = await this.getAccessToken();

    console.debug(`Fetching quote for symbol: ${symbol} with accessToken: ${accessToken}`); // Debug log

    try {
      // 👈 ใส่ Type <AxiosResponse<any>> เช่นกัน
      const response = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.baseUrl}/v2/market/equity/quote`, {
          params: { symbol: symbol },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-App-Code': this.appCode,
          },
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get symbol info: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * ดึงข้อมูลดัชนีหลักทรัพย์ของ SET (เช่น SET, SET50, SET100, sSET)
   * @param indexName ชื่อดัชนีที่ต้องการเจาะจง (ถ้าไม่ใส่จะคืนค่าดัชนีหลักทั้งหมด)
   */
  async getMarketIndices(indexName?: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.baseUrl}/v2/market/equity/indices`, {
          params: indexName ? { index: indexName } : {}, // ส่งฟิลเตอร์หากต้องการระบุเจาะจงดัชนี
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-App-Code': this.appCode,
          },
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get market indices: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * ดึงข้อมูลรายชื่อกลุ่มอุตสาหกรรม และประเภทธุรกิจ (Sectors & Industries)
   */
  async getSectorsAndIndustries(): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      // เรียก Endpoint ดึงรายละเอียดกลุ่มอุตสาหกรรม (Sectors) ทั้งหมดในตลาดหลักทรัพย์
      const response = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.baseUrl}/v2/market/equity/sectors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-App-Code': this.appCode,
          },
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get sectors and industries: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
