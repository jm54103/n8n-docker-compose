import { Inject, Injectable,InternalServerErrorException,LoggerService,UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { AuthLogger } from './auth.logger';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) 
    private readonly logger: LoggerService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(SystemParameter)
    private readonly paramRepo: Repository<SystemParameter>,
    @InjectRedis() 
    private readonly redis: Redis, // Inject Redis เข้ามาใช้งาน    
    private readonly configService: ConfigService, // Inject ConfigService เข้ามา    
    private readonly jwtService: JwtService,
    private readonly auth_logger: AuthLogger
  ) {}

  private async getParam(key: string): Promise<number> {
    const param = await this.paramRepo.findOne({ where: { paramKey: key } });
    return param.getTypedValue() as number;
  }

  private async getConfig(key: string): Promise<string> {
    return this.configService.get<string>(key);
  }


  async loginRepo(user: LoginDto, deviceInfo: string) {

    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');    
    const accessTokenExpiresIn   = await this.getConfig('JWT_EXPIRES_IN');
    const refreshTokenExpiresIn =  await this.getConfig('JWT_REFRESH_EXPIRES_IN');
   
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

    const mins=parseInt(accessTokenExpiresIn, 10);
    const days=parseInt(refreshTokenExpiresIn, 10);

    const accessTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${mins}min` };    
    const refreshTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${days}d` };

   
    const accessToken = this.jwtService.sign(payload, accessTokenJwtSignOptions);
    const refreshToken = this.jwtService.sign(payload, refreshTokenJwtSignOptions);

    session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.sessionRepo.save(session);

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginRedisWithLogging(user: LoginDto, deviceInfo: string) {
    try 
    {
      const sessionId = uuidv4();
      const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
      const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
      const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');

      const payload = { sub: user.username, sessionId };
      const mins = parseInt(accessTokenExpiresIn, 10);
      const days = parseInt(refreshTokenExpiresIn, 10);

      const accessToken = this.jwtService.sign(payload, { expiresIn: `${mins}min` });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: `${days}d` });
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      const sessionData = {
        userId: user.username,
        deviceInfo,
        refreshTokenHash,
        isActive: true,
      };

      // บันทึกลง Redis
      await this.redis.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        'EX',
        sessionTimeout,
      );      
      this.auth_logger.log(`User ${user.username} logged in from device: ${deviceInfo}`, 'AuthService');
      return { accessToken, refreshToken };

    } catch (error) {
      this.logger.error(`Login error for user ${user.username}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('Login failed due to server error');
    }
  }

  async refreshRepo(refreshToken: string) {

    const payload = this.jwtService.verify(refreshToken);

    // 1. ดึงข้อมูลจาก Repository โดยใช้ sessionId จาก Payload
    const session = await this.sessionRepo.findOne({
      where: { sessionId: payload.sessionId, isActive: true },
    });

    if (!session) throw new UnauthorizedException();    

    // 2. ตรวจสอบ Refresh Token Hash
    const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash,);
    if (!isValid) throw new UnauthorizedException();


    // 3. สร้าง Token ใหม่ (Rotation)    
    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');    
    const accessTokenExpiresIn   = await this.getConfig('JWT_EXPIRES_IN');
    const refreshTokenExpiresIn =  await this.getConfig('JWT_REFRESH_EXPIRES_IN');

    const mins=parseInt(accessTokenExpiresIn, 10);
    const days=parseInt(refreshTokenExpiresIn, 10);

    const accessTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${mins}min` };    
    const newAccess = this.jwtService.sign(payload,accessTokenJwtSignOptions);

    const refreshTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${days}d` };    
    const newRefresh = this.jwtService.sign(payload,refreshTokenJwtSignOptions);  

    // 4. อัปเดต Hash ใหม่กลับลง Repository
    session.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
    await this.sessionRepo.save(session);  
    
    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async refreshRedisWithLogging(refreshToken: string) {
    try
    {      
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
      const accessTokenExpiresIn   = await this.getConfig('JWT_EXPIRES_IN');
      const refreshTokenExpiresIn =  await this.getConfig('JWT_REFRESH_EXPIRES_IN');

      const mins=parseInt(accessTokenExpiresIn, 10);
      const days=parseInt(refreshTokenExpiresIn, 10);

      const accessTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${mins}min` };    
      const newAccess = this.jwtService.sign(payload,accessTokenJwtSignOptions);

      const refreshTokenJwtSignOptions: JwtSignOptions = { expiresIn: `${days}d` };    
      const newRefresh = this.jwtService.sign(payload,refreshTokenJwtSignOptions);
        
      // 4. อัปเดต Hash ใหม่กลับลง Redis
      sessionData.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
      await this.redis.set(
        sessionKey,
        JSON.stringify(sessionData),
        'EX',
        sessionTimeout,
      );
      this.logger.warn(`Token rotated for user ${payload.sub}`, 'AuthService');
      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch (error) {
       if (error instanceof UnauthorizedException) throw error;    
      this.logger.error('Refresh token process failed', error.stack, 'AuthService');
      throw new UnauthorizedException('Token verification failed');
    }    
  }

  async logoutRepo(sessionId: string) {
      let session=await this.sessionRepo.update(
        { sessionId },
        { isActive: false },
      );
      return (session==null) ? { success: false } : { success: true };
  }

  async logoutRedisWithLogging(userId: string, sessionId: string) {
    try{
      // สั่งลบ key จาก Redis โดยตรง
      // คืนค่าเป็นจำนวน key ที่ถูกลบ (1 = สำเร็จ, 0 = ไม่เจอ key)
      const result = await this.redis.del(`session:${sessionId}`);  
      this.auth_logger.log(`User ${userId} session ${sessionId} logout`, 'AuthService');           
      return result > 0 ? { success: true } : { success: false } ;
    } catch (error) {
      this.logger.error(`Logout failed for user ${userId} session ${sessionId}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('Logout all failed');
    }
  }

  async logoutAll(userId: string) {
      let session=await this.sessionRepo.update(
        { userId },
        { isActive: false },
      );
      return (session==null) ? { success: false } : { success: true };
  }

  async logoutAllRedisWithLogging(userId: string) {
    try{
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
      this.auth_logger.log(`User ${userId} forced logout from ${deletedCount} sessions`, 'AuthService');
      return deletedCount > 0 ? { success: true } : { success: false };
    } catch (error) {
      this.logger.error(`LogoutAll failed for user ${userId}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('Logout all failed');
    }
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

