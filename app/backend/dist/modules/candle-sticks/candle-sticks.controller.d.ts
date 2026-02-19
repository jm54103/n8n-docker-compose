import { CandleSticksService } from './candle-sticks.service';
import { CandleStick } from '../../entities/candle-stick.entity';
export declare class CandleSticksController {
    private readonly candleSticksService;
    constructor(candleSticksService: CandleSticksService);
    findAll(symbol: string): Promise<CandleStick[]>;
    findByRange(symbol: string, start: string, end: string): Promise<CandleStick[]>;
    create(candleData: Partial<CandleStick>): Promise<CandleStick>;
}
