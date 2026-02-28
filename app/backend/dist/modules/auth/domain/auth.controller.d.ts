import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly userRepo;
    constructor(authService: AuthService, userRepo: Repository<User>);
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<void>;
    logoutAll(req: any): Promise<void>;
    private validateUser;
}
