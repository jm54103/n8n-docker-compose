import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserSession } from '../../entities/user-session.entity';
import { ConfigService } from '@nestjs/config';

// สำหรับ Redis
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis() 
    private readonly redis: Redis, // ฉีด Redis เข้ามาใช้งาน    
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

  // ใน JwtStrategy (ถ้าใช้ @nestjs/passport)
  async validate(payload: any) {       
    //const pretty=JSON.stringify(payload, null, 2);
    //console.debug(`validate(payload) payload : ${pretty}`);   
    const isBlacklisted = await this.isBlacklisted(payload.jti);
    if (isBlacklisted) {      
      throw new UnauthorizedException(`jti: ${payload.jti}, session: ${payload.sessionId} Token has been revoked`); 
    }    
    await this.validateRedis(payload); 
    return payload;
  } 

  /**
  * ตรวจสอบว่า JTI นี้ติด Blacklist หรือไม่
  */
  public async isBlacklisted(jti: string): Promise<boolean> {
    const result = await this.redis.exists(`blacklist:${jti}`);
    return result === 1;
  }

  async validateRedis(payload: any) 
  {  
    const { sessionId } = payload;  
    // 1. ลองดึงข้อมูลจาก Redis ก่อน
    const cachedSession = await this.redis.get(`session:${sessionId}`);  
    if (cachedSession) {
      //console.debug('--- Cache Hit: Session found in Redis ---');
      // ถ้าใน Redis เก็บสถานะไว้ หรือเก็บเป็น String "true"/"false"
      if (cachedSession === 'inactive') {
        throw new UnauthorizedException('Session is no longer active');
      }            
      return cachedSession;  
    }
  }        
}

/*
    // 2. ถ้าใน Redis ไม่มี (Cache Miss) ให้เช็คจาก Database
    console.debug('--- Cache Miss: Checking Database ---');
    const session = await this.sessionRepo.findOne({
    where: { sessionId, isActive: true },
    });

    if (!session) {
      // เก็บสถานะ 'inactive' ไว้สั้นๆ ใน Redis เพื่อป้องกันการยิง DB ซ้ำๆ (Cache Negative Result)
      await this.redis.set(`session:${sessionId}`, 'inactive', 300); // 5 min
      throw new UnauthorizedException('Session is no longer active');
    }
    // 3. ถ้าเจอใน DB ให้เก็บลง Redis (ตั้งเวลา TTL ให้เท่ากับหรือน้อยกว่าอายุ JWT)
    await this.redis.set(`session:${sessionId}`, 'active', 3600); // 1 hour
*/
