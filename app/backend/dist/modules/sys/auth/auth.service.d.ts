import { LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemParameter } from "../system-parameters/entities/system-parameter.entity";
import { UserSession } from "./entities/user-session.entity";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AuthLogger } from './auth.logger';
export declare class AuthService {
    private readonly logger;
    private readonly userRepo;
    private readonly sessionRepo;
    private readonly paramRepo;
    private readonly redis;
    private readonly configService;
    private readonly jwtService;
    private readonly auth_logger;
    constructor(logger: LoggerService, userRepo: Repository<User>, sessionRepo: Repository<UserSession>, paramRepo: Repository<SystemParameter>, redis: Redis, configService: ConfigService, jwtService: JwtService, auth_logger: AuthLogger);
    private getParam;
    private getConfig;
    loginRepo(user: LoginDto, deviceInfo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginRedisWithLogging(user: LoginDto, deviceInfo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshRepo(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshRedisWithLogging(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutRepo(sessionId: string): Promise<{
        success: boolean;
    }>;
    logoutRedisWithLogging(userId: string, sessionId: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
    }>;
    logoutAllRedisWithLogging(userId: string): Promise<{
        success: boolean;
    }>;
    validateUser(dto: LoginDto): Promise<User>;
}
