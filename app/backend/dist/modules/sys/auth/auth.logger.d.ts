import { ConsoleLogger } from '@nestjs/common';
export declare class AuthLogger extends ConsoleLogger {
    log(message: any, context?: string): void;
    getFileName(): string;
}
