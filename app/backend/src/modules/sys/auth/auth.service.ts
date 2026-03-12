
import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SystemParameter } from "../system-parameters/entities/system-parameter.entity";
import { UserSession } from "./entities/user-session.entity";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
// สำหรับ Redis
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { v4 as uuidv4 } from 'uuid'; // แนะนำให้ใช้ uuid สำหรับ sessionId

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(SystemParameter)
    private readonly paramRepo: Repository<SystemParameter>,
    @InjectRedis() 
    private readonly redis: Redis, // ฉีด Redis เข้ามาใช้งาน    
    private readonly configService: ConfigService, // Inject ConfigService เข้ามา    
    private readonly jwtService: JwtService,
  ) {}

  private async getParam(key: string): Promise<number> {
    const param = await this.paramRepo.findOne({ where: { paramKey: key } });
    return param.getTypedValue() as number;
  }

  async loginRepo(user: LoginDto, deviceInfo: string) {

    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');     

    const accessTokenExpire = this.configService.get<number>('JWT_EXPIRES_IN');
    const refreshTokenExpire = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN');

    const session = this.sessionRepo.create({
      userId: user.username,
      expiresAt: new Date(Date.now() + sessionTimeout * 1000),
      deviceInfo,
    });

    await this.sessionRepo.save(session);

    const payload = {
      sub: user.username,
      sessionId: session.sessionId,
    };
   
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m',});
    const refreshToken = this.jwtService.sign(payload, {  expiresIn: '7d',});

    session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.sessionRepo.save(session);

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginRedis(user: LoginDto, deviceInfo: string) {
    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
    const sessionId = uuidv4(); // สร้าง session id ใหม่
    const accessTokenExpire = this.configService.get<number>('JWT_EXPIRES_IN');
    const refreshTokenExpire = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN');

    const payload = { sub: user.username, sessionId };

    //const accessToken = this.jwtService.sign(payload, { expiresIn: accessTokenExpire });
    //const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshTokenExpire });

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m',});
    const refreshToken = this.jwtService.sign(payload, {  expiresIn: '7d',});
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // เก็บข้อมูลลง Redis (ใช้ sessionId เป็น Key)
    // สามารถเก็บเป็น JSON string
    const sessionData = {
      userId: user.username,
      deviceInfo,
      refreshTokenHash,
      isActive: true,
    };

    console.log('Session Data to store in Redis:', sessionData);
    console.log('sessionTimeout:', sessionTimeout);

    // บันทึกลง Redis พร้อมตั้งเวลาล่วงลับ (TTL)
    await this.redis.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      'EX',
      sessionTimeout,
    );

    return { accessToken, refreshToken };
  }

  async refreshRepo(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    const session = await this.sessionRepo.findOne({
      where: { sessionId: payload.sessionId, isActive: true },
    });

    if (!session) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) throw new UnauthorizedException();

    // Rotate refresh token
    const newRefresh = this.jwtService.sign(
      { sub: payload.sub, sessionId: payload.sessionId },
      { expiresIn: '7d' },
    );

    session.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
    await this.sessionRepo.save(session);

    const newAccess = this.jwtService.sign(
      { sub: payload.sub, sessionId: payload.sessionId },
      { expiresIn: '15m' },
    );

    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
    };
  }

  async refreshRedis(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const sessionKey = `session:${payload.sessionId}`;

    // 1. ดึงข้อมูลจาก Redis
    const cachedSession = await this.redis.get(sessionKey);
    if (!cachedSession) throw new UnauthorizedException('Session expired');

    const sessionData = JSON.parse(cachedSession);

    // 2. ตรวจสอบ Refresh Token Hash
    const isValid = await bcrypt.compare(refreshToken, sessionData.refreshTokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    // 3. สร้าง Token ใหม่ (Rotation)
    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
    const newRefresh = this.jwtService.sign(
      { sub: payload.sub, sessionId: payload.sessionId },
      { expiresIn: '7d' },
    );
    const newAccess = this.jwtService.sign(
      { sub: payload.sub, sessionId: payload.sessionId },
      { expiresIn: '15m' },
    );
  
    // 4. อัปเดต Hash ใหม่กลับลง Redis
    sessionData.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
    await this.redis.set(
      sessionKey,
      JSON.stringify(sessionData),
      'EX',
      sessionTimeout,
    );

    console.log('Session Data updated in Redis:', sessionData);
    console.log('sessionTimeout:', sessionTimeout);

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logoutRepo(sessionId: string) {
      let session=await this.sessionRepo.update(
        { sessionId },
        { isActive: false },
      );
      return (session==null) ? undefined : { success: true };
  }

  async logoutRedis(sessionId: string) {
    // สั่งลบ key จาก Redis โดยตรง
    // คืนค่าเป็นจำนวน key ที่ถูกลบ (1 = สำเร็จ, 0 = ไม่เจอ key)
    const result = await this.redis.del(`session:${sessionId}`);        
    return result > 0 ? { success: true } : undefined;
  }


  async logoutAll(userId: string) {
      let session=await this.sessionRepo.update(
        { userId },
        { isActive: false },
      );
      return (session==null) ? undefined : { success: true };
  }

  async logoutAllRedis(userId: string) {
    // ค้นหา key ทั้งหมดที่ข้อมูลข้างในมี userId ตรงกัน (หรือใช้ naming convention)
    // หมายเหตุ: ใน Production ที่มี data เยอะๆ แนะนำให้เก็บ key แบบ 'user:{userId}:sessions' เป็น Set จะเร็วขึ้น
    const keys = await this.redis.keys('session:*');
    let deletedCount = 0;

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const session = JSON.parse(data);
        if (session.userId === userId) {
          await this.redis.del(key);
          deletedCount++;
        }
      }
    }
    return deletedCount > 0 ? { success: true } : undefined;
  }
  
  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.username = :username', { username: dto.username })
      .getOne();
  
    if (!user) throw new UnauthorizedException();
  
    const isMatch = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
  
    if (!isMatch) throw new UnauthorizedException();
  
    return user;
  }

}

