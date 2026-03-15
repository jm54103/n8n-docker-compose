import { ForbiddenException, Inject, Injectable,InternalServerErrorException,LoggerService,UnauthorizedException } from '@nestjs/common';
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



  private async getSystemParameter(key: string): Promise<number> {
    const redisKey = `config:param:${key}`;

    try {
      // 1. ตรวจสอบค่าใน Redis
      const cachedValue = await this.redis.get(redisKey);
      
      if (cachedValue !== null) {
        return Number(cachedValue);
      }

      // 2. ถ้าไม่มีใน Redis ให้ดึงจาก Database
      const param = await this.paramRepo.findOne({ where: { paramKey: key } });
      if (!param) return null;

      const value = param.getTypedValue() as number;

      // 3. บันทึกลง Redis พร้อมตั้งเวลาหมดอายุ (TTL) เช่น 1 ชั่วโมง (3600 วินาที)
      // ใช้ 'EX' สำหรับ set expiration
      await this.redis.set(redisKey, value.toString(), 'EX', 3600);

      return value;
    } catch (error) {
      // Fallback: ถ้า Redis ล่ม ให้ดึงจาก DB ตรงๆ เพื่อไม่ให้ระบบ Login พัง
      console.error('Redis Error:', error);
      const param = await this.paramRepo.findOne({ where: { paramKey: key } });
      return param ? (param.getTypedValue() as number) : null;
    }
  }

  private async getConfig(key: string): Promise<string> {
    return this.configService.get<string>(key);
  }

  public async login(LoginDto: LoginDto, deviceInfo: string) {
    const user = await this.checkPassword(LoginDto);
    if (user) {
      return await this.loginRedisWithLogging(LoginDto, deviceInfo)
    }
  }

  public async refresh(refreshToken: string) {
    return await this.refreshRedisWithLogging(refreshToken);
  }

  public async logout(userId: string, sessionId: string) {
    return await this.logoutRedisWithLogging(userId, sessionId);
  }
  public async logoutAll(userId: string) {
    return await this.logoutAllRedisWithLogging(userId);  
  } 

  private async checkPassword(LoginDto: LoginDto): Promise<User> {
    
    const username = LoginDto.username.trim().toLowerCase(); // Normalize username
    const password = LoginDto.password;


    // 1. ค้นหา User (รวมถึงฟิลด์ที่จำเป็นต้องใช้เช็คเงื่อนไข)
    const user = await this.userRepo.findOne(
      { where: { username },
        select: ['userId', 'username', 'passwordHash', 'isActive', 'status', 'loginAttempts', 'lockUntil'] 
      });

    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    const now = new Date();

    // 2. ตรวจสอบสถานะการใช้งาน (is_active / status)
    if (!user.isActive || user.status !== 'ACTIVE') {
      throw new ForbiddenException('บัญชีนี้ถูกระงับการใช้งาน');
    }

    // 3. ตรวจสอบการโดนล็อก (lock_until)
    if (user.lockUntil && user.lockUntil > now) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - now.getTime()) / 60000);
      throw new ForbiddenException(`บัญชีถูกล็อกชั่วคราว กรุณาลองใหม่ในอีก ${remainingMinutes} นาที`);
    }

    if (!password || !user.passwordHash) {
    throw new UnauthorizedException('ข้อมูลไม่ครบถ้วน');
}

    // Debug log 
    console.debug(`User ${username} found. Proceeding to password check...`); 
    
    // 4. ตรวจสอบรหัสผ่านด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      // --- กรณีรหัสผ่านถูกต้อง ---
      user.loginAttempts = 0;
      user.lockUntil = null;
      user.lastLogin = now;
      user.isLoggedIn = true;
      // user.session_key = ... (สร้าง session/token ใหม่ถ้าต้องการเก็บลง DB)      
      return await this.userRepo.save(user);

    } else {
      // --- กรณีรหัสผ่านผิด ---
      const MAX_LOGIN_ATTEMPTS = await this.getSystemParameter('MAX_LOGIN_ATTEMPTS');     
      const LOCKOUT_DURATION_MINUTES = await this.getSystemParameter('LOCKOUT_DURATION_MINUTES');
          
      user.loginAttempts += 1;

      // เงื่อนไข: ถ้าผิดครบ MAX_LOGIN_ATTEMPTS ครั้ง ให้ล็อกบัญชี LOCKOUT_DURATION_MINUTES นาที
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(now.getTime() + LOCKOUT_DURATION_MINUTES * 60000);
      }

      await this.userRepo.save(user);

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        throw new ForbiddenException('รหัสผ่านผิดเกินกำหนด บัญชีของคุณถูกล็อก 30 นาที');
      }
      
      throw new UnauthorizedException('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  }


  private async loginRepo(user: LoginDto, deviceInfo: string) {

    const sessionTimeout = await this.getSystemParameter('SESSION_TIMEOUT_SEC');    
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

  

  private async loginRedisWithLogging(user: LoginDto, deviceInfo: string) {
    try 
    {
      const sessionId = uuidv4();      
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
      const refreshTokenTTL = days * 24 * 60 * 60; // แปลง '7d' เป็นวินาที
      await this.redis.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        'EX',
        refreshTokenTTL
      );      
      this.auth_logger.log(`User ${user.username} logged in from device: ${deviceInfo}`, 'AuthService');
      return { accessToken, refreshToken };

    } catch (error) {
      this.logger.error(`Login error for user ${user.username}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('Login failed due to server error');
    }
  }

  private async refreshRepo(refreshToken: string) {

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
    const sessionTimeout = await this.getSystemParameter('SESSION_TIMEOUT_SEC');    
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

  private async refreshRedisWithLogging(refreshToken: string) {
    
    try
    {               

      const payload = this.jwtService.verify(refreshToken);
      const sessionKey = `session:${payload.sessionId}`;
            
      // 1. ดึงข้อมูลจาก Redis
      const cachedSession = await this.redis.get(sessionKey);
      if (!cachedSession) {
        console.debug(`No session found in Redis for sessionId ${payload.sessionId}`); 
        throw new UnauthorizedException('Session expired');
      }
      console.debug(`Token refreshed for session ${payload.sessionId}, user ${payload.sub}`); 

      const sessionData = JSON.parse(cachedSession);

      // 2. ตรวจสอบ Refresh Token Hash
      const isValid = await bcrypt.compare(refreshToken, sessionData.refreshTokenHash);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');
      console.debug(`Refresh token valid for session ${payload.sessionId}, user ${payload.sub}`); 

      // 3. สร้าง Token ใหม่ (Rotation)        
      const sessionTimeout = await this.getSystemParameter('SESSION_TIMEOUT_SEC');
      const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
      const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');

      const new_payload = { sub: payload.sub, sessionId: payload.sessionId };
      const mins = parseInt(accessTokenExpiresIn, 10);
      const days = parseInt(refreshTokenExpiresIn, 10);

      const new_accessToken = this.jwtService.sign(new_payload, { expiresIn: `${mins}min` });
      const new_refreshToken = this.jwtService.sign(new_payload, { expiresIn: `${days}d` });      

      console.debug(`New tokens generated for session ${payload.sessionId}, user ${payload.sub}`); 
        
      // 4. อัปเดต Hash ใหม่กลับลง Redis      
      sessionData.refreshTokenHash = await bcrypt.hash(new_refreshToken, 10);
      sessionData.lastRefreshedAt = new Date().toISOString(); // เพิ่ม log เวลาที่ refresh ล่าสุด
      // ใช้ค่า TTL (Time To Live) ที่สัมพันธ์กับ Refresh Token
      const refreshTokenTTL = days * 24 * 60 * 60; // แปลง '7d' เป็นวินาที
      
      await this.redis.set(
        sessionKey,
        JSON.stringify(sessionData),
        'EX',        
        refreshTokenTTL // ใช้เวลาของ Refresh Token เป็นตัวตัดสินอายุของ Session ใน Redis
      );

      this.logger.warn(`Token rotated for user ${payload.sub}`, 'AuthService');
      
      return { accessToken: new_accessToken, refreshToken: new_refreshToken };    

    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;    
      this.logger.error('Refresh token process failed', error.stack, 'AuthService');
      throw new UnauthorizedException('Token verification failed');
    } 
       
  }

  private async logoutRepo(sessionId: string) {
      let session=await this.sessionRepo.update(
        { sessionId },
        { isActive: false },
      );
      return (session==null) ? { success: false } : { success: true };
  }

  private async logoutRedisWithLogging(userId: string, sessionId: string) {
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

  private async logoutAllRepo(userId: string) {
      let session=await this.sessionRepo.update(
        { userId },
        { isActive: false },
      );
      return (session==null) ? { success: false } : { success: true };
  }

  private async logoutAllRedisWithLogging(userId: string) {
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
  
  

}

