import { JwtService } from '@nestjs/jwt';
import { SystemParameter } from "../system-parameters/entities/system-parameter.entity";
import { UserSession } from "./entities/session.entity";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private readonly userRepo;
    private readonly sessionRepo;
    private readonly paramRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, sessionRepo: Repository<UserSession>, paramRepo: Repository<SystemParameter>, jwtService: JwtService);
    private getParam;
    login(user: User, deviceInfo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(sessionId: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
}
