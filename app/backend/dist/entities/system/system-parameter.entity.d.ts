export declare class SystemParameter {
    paramId: number;
    paramKey: string;
    paramValue: string;
    valueType: string;
    description: string;
    updatedAt: Date;
    getTypedValue(): string | number | boolean;
}
