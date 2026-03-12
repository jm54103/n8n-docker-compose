import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { UserSession } from '../../entities/user-session.entity';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly redis;
    private readonly sessionRepo;
    private readonly configService;
    constructor(redis: Redis, sessionRepo: Repository<UserSession>, configService: ConfigService);
    validate(payload: any): Promise<any>;
    validateByRepo(payload: any): Promise<any>;
    validateRedis(payload: any): Promise<any>;
}
export {};
