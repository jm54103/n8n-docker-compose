import { Test, TestingModule } from '@nestjs/testing';
import { CandleSticksService } from './candle-sticks.service';

describe('CandleSticksService', () => {
  let service: CandleSticksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandleSticksService],
    }).compile();

    service = module.get<CandleSticksService>(CandleSticksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
