import { JwtService } from '@nestjs/jwt';
import { SystemParameter } from "../system-parameters/entities/system-parameter.entity";
import { UserSession } from "./entities/user-session.entity";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class AuthService {
    private readonly userRepo;
    private readonly sessionRepo;
    private readonly paramRepo;
    private readonly redis;
    private readonly configService;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, sessionRepo: Repository<UserSession>, paramRepo: Repository<SystemParameter>, redis: Redis, configService: ConfigService, jwtService: JwtService);
    private getParam;
    private getConfig;
    loginRepo(user: LoginDto, deviceInfo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginRedis(user: LoginDto, deviceInfo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshRepo(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshRedis(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutRepo(sessionId: string): Promise<{
        success: boolean;
    }>;
    logoutRedis(sessionId: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
    }>;
    logoutAllRedis(userId: string): Promise<{
        success: boolean;
    }>;
    validateUser(dto: LoginDto): Promise<User>;
}
