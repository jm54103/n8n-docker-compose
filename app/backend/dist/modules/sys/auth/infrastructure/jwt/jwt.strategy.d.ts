import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { UserSession } from '../../entities/user-session.entity';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly sessionRepo;
    private readonly configService;
    constructor(sessionRepo: Repository<UserSession>, configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
