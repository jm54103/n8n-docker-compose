import { Test, TestingModule } from '@nestjs/testing';
import { SettradeService } from './settrade.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SettradeService', () => {
  let service: SettradeService;
  let httpService: HttpService;

  // จำลอง Mock HttpService
  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettradeService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SettradeService>(SettradeService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessToken', () => {
    it('ควรจะคืนค่า access_token เมื่อเข้าสู่ระบบสำเร็จ', async () => {
      const mockResult: AxiosResponse = {
        data: { access_token: 'mock-sandbox-token-1234' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };

      // จำลองให้ httpService.post คืนค่ากลับมาเป็น RxJS Observable (เพราะ Nest ใช้ RxJS)
      mockHttpService.post.mockReturnValue(of(mockResult));

      const token = await service.getAccessToken();
      expect(token).toEqual('mock-sandbox-token-1234');
      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });

  describe('getSymbolQuote', () => {
    it('ควรจะคืนข้อมูลราคาหุ้นเมื่อใส่ Symbol ที่ถูกต้อง', async () => {
      // 1. Mock ตอน login
      const mockTokenResult: AxiosResponse = {
        data: { access_token: 'mock-token' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      mockHttpService.post.mockReturnValue(of(mockTokenResult));

      // 2. Mock ตอนดึงข้อมูลหุ้น
      const mockQuoteResult: AxiosResponse = {
        data: { symbol: 'PTT', last: 34.75 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      mockHttpService.get.mockReturnValue(of(mockQuoteResult));

      const result = await service.getSymbolQuote('PTT');
      
      expect(result).toEqual({ symbol: 'PTT', last: 34.75 });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/market/equity/quote'),
        expect.any(Object)
      );
    });
  });

  // ... (โค้ดเดิมของ getAccessToken และ getSymbolQuote) ...

  describe('getAllSymbols', () => {
    it('ควรจะคืนรายชื่อผลิตภัณฑ์ทั้งหมดเมื่อเรียกสำเร็จ', async () => {
      // 1. Mock token
      mockHttpService.post.mockReturnValue(of({ data: { access_token: 'mock-token' } }));

      // 2. Mock ผลลัพธ์รายชื่อหุ้น
      const mockProductsResult: AxiosResponse = {
        data: [{ symbol: 'AOT', market: 'SET' }, { symbol: 'PTT', market: 'SET' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      mockHttpService.get.mockReturnValue(of(mockProductsResult));

      const result = await service.getAllSymbols();

      expect(result).toEqual([{ symbol: 'AOT', market: 'SET' }, { symbol: 'PTT', market: 'SET' }]);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/market/equity/products'),
        expect.any(Object)
      );
    });
  });

  describe('getMarketIndices', () => {
    it('ควรจะคืนข้อมูลดัชนีตลาดตามพารามิเตอร์ที่ส่งไป', async () => {
      mockHttpService.post.mockReturnValue(of({ data: { access_token: 'mock-token' } }));

      const mockIndicesResult: AxiosResponse = {
        data: { index: 'SET50', last: 950.5 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      mockHttpService.get.mockReturnValue(of(mockIndicesResult));

      const result = await service.getMarketIndices('SET50');

      expect(result).toEqual({ index: 'SET50', last: 950.5 });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/market/equity/indices'),
        expect.objectContaining({ params: { index: 'SET50' } })
      );
    });
  });

  describe('getSectorsAndIndustries', () => {
    it('ควรจะคืนข้อมูลกลุ่มอุตสาhกรรมทั้งหมดสำเร็จ', async () => {
      mockHttpService.post.mockReturnValue(of({ data: { access_token: 'mock-token' } }));

      const mockSectorsResult: AxiosResponse = {
        data: [{ sector: 'BANK', last: 350.2 }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      mockHttpService.get.mockReturnValue(of(mockSectorsResult));

      const result = await service.getSectorsAndIndustries();

      expect(result).toEqual([{ sector: 'BANK', last: 350.2 }]);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/market/equity/sectors'),
        expect.any(Object)
      );
    });
  });
});