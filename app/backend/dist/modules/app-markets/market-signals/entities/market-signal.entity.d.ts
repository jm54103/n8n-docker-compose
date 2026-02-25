export declare class ColumnNumericTransformer {
    to(data: number): number;
    from(data: string): number;
}
export declare class MarketSignal {
    id: number;
    symbol: string;
    last_close: number;
    signal: string;
    trend: string;
    rsi_14: number;
    rsi_overbought: number;
    rsi_oversold: number;
    ema_50: number;
    ema_200: number;
    golden_cross: boolean;
    death_cross: boolean;
    updated_at: Date;
}
