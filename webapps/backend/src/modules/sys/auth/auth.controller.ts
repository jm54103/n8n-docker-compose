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
    console.debug('Logging in user:', dto.username);
    return this.authService.login(dto, req.headers['user-agent'] as string);
  }
  
  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  async refresh(@Body() dto: RefreshDto) {
    //console.debug('Refreshing token with refreshToken:', dto.refreshToken);
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)     
  @Post('logout')
  async logout(@Req() req: Request & { user: JwtPayload }) {
    console.debug('Logging out session:', req.user.sessionId);    
    return this.authService.logout(req.user.sub, req.user.sessionId);
  }

  @ApiBearerAuth('accessToken')  
  @UseGuards(JwtAuthGuard)  
  @Post('logout-all')
  async logoutAll(@Req() req: Request & { user: JwtPayload }) {
    console.debug('Logging out all sessions for user:', req.user.sub);    
    return this.authService.logoutAll(req.user.sub);
  }
  
}


