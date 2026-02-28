import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtPayload } from './infrastructure/jwt/jwt.payload';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: Request & {
        user: JwtPayload;
    }): Promise<{
        success: boolean;
    }>;
    logoutAll(req: Request & {
        user: JwtPayload;
    }): Promise<{
        success: boolean;
    }>;
}
