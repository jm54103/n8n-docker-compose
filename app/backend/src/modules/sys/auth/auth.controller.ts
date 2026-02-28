import { Controller,  Post,  Body,  Req,  UseGuards,  UnauthorizedException,} from '@nestjs/common';
import { ApiTags,  ApiBearerAuth,  ApiBody, } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './infrastructure/jwt/jwt-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { JwtPayload } from './infrastructure/jwt/jwt.payload';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(
      dto,
      req.headers['user-agent'] as string,
    );
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.logout(req.user.sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout-all')
  async logoutAll(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.logoutAll(req.user.sub);
  }
}


/*
ถ้าอยากอัปเกรดเป็น Enterprise จริง ๆ

ขั้นถัดไปที่แนะนำ:

🔐 Refresh Token Rotation

🔐 Redis session store

🔐 Token Blacklist

🔐 RBAC Guard

🔐 Device Fingerprint

🔐 2FA

🔐 Key Rotation (JWT versioning)

ถ้าคุณบอกว่า:

“ทำ Auth ให้ระดับ enterprise เลย”

ผมจะจัด architecture แบบ production-scale ให้ครบทั้ง security hardening + performance + scalability 🚀
*/