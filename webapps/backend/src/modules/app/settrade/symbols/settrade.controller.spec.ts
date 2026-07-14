import { Test, TestingModule } from '@nestjs/testing';
import { SettradeController } from './settrade.controller';
import { SettradeService } from './settrade.service';

describe('SettradeController', () => {
  let controller: SettradeController;
  let service: SettradeService;

  // อย่าลืมเพิ่มฟังก์ชั่นเหล่านี้ใน mockSettradeService ด้านบนด้วยนะครับ:
  const mockSettradeService = {
     getSymbolQuote: jest.fn(),
     getAllSymbols: jest.fn(),
     getMarketIndices: jest.fn(),
     getSectorsAndIndustries: jest.fn(),
   };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettradeController],
      providers: [
        {
          provide: SettradeService,
          useValue: mockSettradeService,
        },
      ],
    }).compile();

    controller = module.get<SettradeController>(SettradeController);
    service = module.get<SettradeService>(SettradeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuote', () => {
    it('ควรจะเรียกใช้งาน service.getSymbolQuote พร้อมส่งค่า symbol ไปถูกต้อง', async () => {
      const mockData = { symbol: 'ADVANC', last: 210.0 };
      mockSettradeService.getSymbolQuote.mockResolvedValue(mockData);

      const result = await controller.getQuote('ADVANC');

      expect(service.getSymbolQuote).toHaveBeenCalledWith('ADVANC');
      expect(result).toEqual(mockData);
    });
  });

  // ... (โค้ดเดิมของ mockSettradeService และ getQuote) ...
  
 

  describe('getAllSymbols', () => {
    it('ควรจะเรียก service.getAllSymbols และคืนค่ารายชื่อหุ้นกลับไป', async () => {
      const mockData = [{ symbol: 'PTT' }];
      mockSettradeService.getAllSymbols.mockResolvedValue(mockData);

      const result = await controller.getAllSymbols();

      expect(service.getAllSymbols).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('getIndices', () => {
    it('ควรจะเรียก service.getMarketIndices พร้อมส่ง Query Param ไปถูกต้อง', async () => {
      const mockData = { index: 'SET' };
      mockSettradeService.getMarketIndices.mockResolvedValue(mockData);

      const result = await controller.getIndices('SET');

      expect(service.getMarketIndices).toHaveBeenCalledWith('SET');
      expect(result).toEqual(mockData);
    });
  });

  describe('getSectors', () => {
    it('ควรจะเรียก service.getSectorsAndIndustries และคืนค่ากลุ่มธุรกิจกลับไป', async () => {
      const mockData = [{ sector: 'ICT' }];
      mockSettradeService.getSectorsAndIndustries.mockResolvedValue(mockData);

      const result = await controller.getSectors();

      expect(service.getSectorsAndIndustries).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
  
});