import { Test, TestingModule } from '@nestjs/testing';
import { CandleSticksController } from './candle-sticks.controller';

describe('CandleSticksController', () => {
  let controller: CandleSticksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandleSticksController],
    }).compile();

    controller = module.get<CandleSticksController>(CandleSticksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
