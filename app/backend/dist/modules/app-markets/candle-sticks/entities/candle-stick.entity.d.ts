export declare class ColumnNumericTransformer {
    to(data: number): number;
    from(data: string): number;
}
export declare class DateToNumberTransformer {
    to(data: Date): Date;
    from(data: string | Date): number;
}
export declare class CandleStick {
    symbol: string;
    x: Date;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}
