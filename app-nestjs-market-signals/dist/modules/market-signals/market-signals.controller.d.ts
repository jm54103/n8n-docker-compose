import { MarketSignalsService } from './market-signals.service';
export declare class MarketSignalsController {
    private readonly service;
    constructor(service: MarketSignalsService);
    getAll(): Promise<import("../../entities/market-signal.entity").MarketSignal[]>;
    getBullish(): Promise<import("../../entities/market-signal.entity").MarketSignal[]>;
    getOne(symbol: string): Promise<import("../../entities/market-signal.entity").MarketSignal>;
}
