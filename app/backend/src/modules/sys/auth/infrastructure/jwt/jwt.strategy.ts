import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserSession } from '../../entities/user-session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly configService: ConfigService, // Inject ConfigService เข้ามา
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // แนะนำให้เช็ควันหมดอายุด้วย
      secretOrKey: configService.get<string>('JWT_SECRET'), // ใช้ผ่าน configService
    });
  }

  async validate(payload: any) {


    console.log('1. JWT Payload:', payload);

    // ถ้ารหัสผ่าน (Secret) ถูกต้อง มันจะเข้ามาทำงานในนี้
    const session = await this.sessionRepo.findOne({
      where: { sessionId: payload.sessionId, isActive: true },
    });

    console.log('2. Session from DB:', session);

    if (!session) {
      console.log('3. Validate Failed: Session not found or inactive');
      throw new UnauthorizedException('Session is no longer active');
    }

    return payload; // ข้อมูลนี้จะไปอยู่ที่ req.user
  }
}
