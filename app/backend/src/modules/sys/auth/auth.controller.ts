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
    /*--Redis--*/
    console.log('Logging in user:', dto.username);
    return this.authService.loginRedis(dto, req.headers['user-agent'] as string);
  }
  
  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  async refresh(@Body() dto: RefreshDto) {
    console.log('Refreshing token with refreshToken:', dto.refreshToken);
    /*--Redis--*/
    return this.authService.refreshRedis(dto.refreshToken);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)     
  @Post('logout')
  async logout(@Req() req: Request & { user: JwtPayload }) {
    console.log('Logging out session:', req.user.sessionId);
    /*--Redis--*/
    return this.authService.logoutRedis(req.user.sessionId);
  }

  @ApiBearerAuth('accessToken')  
  @UseGuards(JwtAuthGuard)  
  @Post('logout-all')
  async logoutAll(@Req() req: Request & { user: JwtPayload }) {
    console.log('Logging out all sessions for user:', req.user.sub);
    /*--Redis--*/
    return this.authService.logoutAllRedis(req.user.sub);
  }
  
}


