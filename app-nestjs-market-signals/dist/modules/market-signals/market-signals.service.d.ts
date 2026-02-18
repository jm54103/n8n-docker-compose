import { Repository } from 'typeorm';
import { MarketSignal } from '../../entities/market-signal.entity';
export declare class MarketSignalsService {
    private repo;
    constructor(repo: Repository<MarketSignal>);
    findAll(): Promise<MarketSignal[]>;
    findBySymbol(symbol: string): Promise<MarketSignal>;
    findBullish(): Promise<MarketSignal[]>;
}
