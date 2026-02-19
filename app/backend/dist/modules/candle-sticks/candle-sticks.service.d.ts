import { Repository } from 'typeorm';
import { CandleStick } from '../../entities/candle-stick.entity';
export declare class CandleSticksService {
    private readonly candleRepository;
    constructor(candleRepository: Repository<CandleStick>);
    findAllBySymbol(symbol: string): Promise<CandleStick[]>;
    findByDateRange(symbol: string, startDate: Date, endDate: Date): Promise<CandleStick[]>;
    create(data: Partial<CandleStick>): Promise<CandleStick>;
    remove(symbol: string, x: Date): Promise<void>;
}
