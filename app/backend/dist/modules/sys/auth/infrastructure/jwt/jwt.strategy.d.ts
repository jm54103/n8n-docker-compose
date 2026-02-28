import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { UserSession } from '../../entities/user-session.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly sessionRepo;
    constructor(sessionRepo: Repository<UserSession>);
    validate(payload: any): Promise<any>;
}
export {};
