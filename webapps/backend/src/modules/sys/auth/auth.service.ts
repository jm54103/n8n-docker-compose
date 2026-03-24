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
      console.error('🔥 Redis Error:', error);
      const param = await this.paramRepo.findOne({ where: { paramKey: key } });
      return param ? (param.getTypedValue() as number) : null;
    }
  }

  private async getConfig(key: string): Promise<string> {
    return this.configService.get<string>(key);
  }

  public async login(LoginDto: LoginDto, deviceInfo: string) {
    const user = await this.verify(LoginDto);
    if (user) {      
      return await this.loginRedis(LoginDto, deviceInfo)
    }
  }

  public async refresh(refreshToken: string) {
    return await this.refreshRedis(refreshToken);
  }

  public async logout(userId: string, sessionId: string) {
    return await this.logoutRedis(userId, sessionId);
  }
  public async logoutAll(userId: string) {
    return await this.logoutAllRedis(userId);  
  } 

  private async verify(LoginDto: LoginDto): Promise<User> {
    
    const username = LoginDto.username.trim().toLowerCase(); // Normalize username
    const password = LoginDto.password;


    // 1. ค้นหา User (รวมถึงฟิลด์ที่จำเป็นต้องใช้เช็คเงื่อนไข)
    const user = await this.userRepo.findOne(
      { where: { username },
        select: ['userId', 'username', 'passwordHash', 'isActive', 'status', 'loginAttempts', 'lockUntil'] 
      });

    if (!user) {
      throw new UnauthorizedException('🚫 ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    const now = new Date();

    // 2. ตรวจสอบสถานะการใช้งาน (is_active / status)
    if (!user.isActive || user.status !== 'ACTIVE') {
      throw new ForbiddenException('บัญชีนี้ถูกระงับการใช้งาน');
    }

    // 3. ตรวจสอบการโดนล็อก (lock_until)
    if (user.lockUntil && user.lockUntil > now) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - now.getTime()) / 60000);
      throw new ForbiddenException(`📵 บัญชีถูกล็อกชั่วคราว กรุณาลองใหม่ในอีก ${remainingMinutes} นาที`);
    }

    if (!password || !user.passwordHash) {
      throw new UnauthorizedException(`❌ ข้อมูลไม่ครบถ้วน`);
    }

    // Debug log 
    console.debug(`👤 User ${username} found. Proceeding to password check...`); 
    
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
        throw new ForbiddenException('📵 รหัสผ่านผิดเกินกำหนด บัญชีของคุณถูกล็อก 30 นาที');
      }
      
      throw new UnauthorizedException('🚫 ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
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

  private async refreshRedis(refreshToken: string) {
  try {
    // 1. Verify และถอด Payload (ตรวจสอบ Signature และ Expiry อัตโนมัติ)
    const payload = this.jwtService.verify(refreshToken);
    const sessionKey = `session:${payload.sessionId}`;

    // 2. ดึงข้อมูลจาก Redis
    const cachedSession = await this.redis.get(sessionKey);
    if (!cachedSession) {
      throw new UnauthorizedException('⌛ Session expired or not found');
    }

    const sessionData = JSON.parse(cachedSession);

    // 3. ตรวจสอบ Refresh Token Hash (ป้องกัน Token Reuse)
    const isValid = await bcrypt.compare(refreshToken, sessionData.refreshTokenHash);
    if (!isValid) {
      // ⚠️ หาก Hash ไม่ตรง อาจหมายถึง Token ถูกขโมยและพยายามใช้ซ้ำ
      // ควรพิจารณาลบ Session ทิ้งเพื่อความปลอดภัยสูงสุด
      await this.logoutRedis(payload.sub, payload.sessionId);
      throw new UnauthorizedException('🚫 Invalid refresh token - potentially compromised');
    }

    // --- เริ่มขั้นตอน Rotation ---

    // 4. สร้าง JTI ใหม่สำหรับ Access Token ใบใหม่
    const newJti = uuidv4();
    const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
    const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');

    const mins = parseInt(accessTokenExpiresIn, 10);
    const days = parseInt(refreshTokenExpiresIn, 10);

    // 5. เตรียม Payload ใหม่ (รักษา sessionId เดิมไว้)
    const new_payload = { 
      sub: payload.sub, 
      sessionId: payload.sessionId,
      jti: newJti 
    };

    const new_accessToken = this.jwtService.sign(new_payload, { expiresIn: `${mins}min` });
    const new_refreshToken = this.jwtService.sign(new_payload, { expiresIn: `${days}d` });

    // 6. แบน JTI ตัวเก่า (ถ้ามีอยู่ใน Payload เดิม) เพื่อไม่ให้ Access Token ใบเก่าใช้ได้อีก
    if (payload.jti) {
      await this.revoke(payload.jti, mins * 60); // แบนตามอายุขัยของมัน
    }

    // 7. อัปเดตข้อมูล Session ใน Redis
    sessionData.refreshTokenHash = await bcrypt.hash(new_refreshToken, 10);
    sessionData.jti = newJti; // เก็บ JTI ตัวปัจจุบันไว้ใน Session
    sessionData.lastRefreshedAt = new Date().toISOString();

    const refreshTokenTTL = days * 24 * 60 * 60;
    
    // อัปเดต Redis และต่ออายุ TTL
    await this.redis.set(
      sessionKey,
      JSON.stringify(sessionData),
      'EX',
      refreshTokenTTL
    );

    this.logger.warn(`🔄 Token rotated: User ${payload.sub}, Session ${payload.sessionId}`, 'AuthService');

    return { 
      accessToken: new_accessToken, 
      refreshToken: new_refreshToken 
    };

  } catch (error) {
    if (error instanceof UnauthorizedException) throw error;
    this.logger.error('❌🔄 Refresh token process failed', error.stack, 'AuthService');
    throw new UnauthorizedException('❌🔄 Token verification failed');
  }
}


  private async loginRedis  (user: LoginDto, deviceInfo: string) {
    try {
      const sessionId = uuidv4();
      const jti = uuidv4(); 
      const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
      const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');
      const permissions = ['USER_MANAGEMENT','SETTING'];

      const payload = { 
            sub: user.username
           , sessionId
           , jti 
           , group: { permissions }
          };

      const mins = parseInt(accessTokenExpiresIn, 10);
      const days = parseInt(refreshTokenExpiresIn, 10);

      const accessToken = this.jwtService.sign(payload, { expiresIn: `${mins}min` });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: `${days}d` });
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
     
      const sessionData = {
        userId: user.username,
        deviceInfo,
        refreshTokenHash,
        jti, // เก็บ jti ไว้ใน session data ด้วย เพื่อใช้ทำ blacklist ตอนสั่ง logout all
        isActive: true,
      };

      const refreshTokenTTL = days * 24 * 60 * 60;
      const sessionKey = `session:${sessionId}`;
      const userIndexKey = `user_sessions:${user.username}`; // Index สำหรับเก็บทุก sessionId ของ user นี้

      // ใช้ Pipeline หรือ Promise.all เพื่อความเร็ว
      await Promise.all([
        // 1. เก็บข้อมูล Session หลัก
        this.redis.set(sessionKey, JSON.stringify(sessionData), 'EX', refreshTokenTTL),
        
        // 2. เก็บ Index ว่า User นี้มี Session ID อะไรบ้าง (ใช้ Set)
        this.redis.sadd(userIndexKey, sessionId),
        
        // 3. ตั้งเวลาตายให้ Index เท่ากับ Refresh Token
        this.redis.expire(userIndexKey, refreshTokenTTL)
      ]);

      this.logger.warn(`🔒 User ${user.username} logged in. JTI: ${jti}`, 'AuthService');
      return { accessToken, refreshToken };

    } catch (error) {
      this.logger.error(`❌🔒 Login error for user ${user.username}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('❌🔒 Login failed');
    }
  }


  private async logoutRedis(userId: string, sessionId: string) {
  try {
    const sessionKey = `session:${sessionId}`;
    const userSessionsKey = `user:${userId}:sessions`;

    // 1. ดึงข้อมูล Session มาก่อนเพื่อเอา jti (เอาไว้ทำ Blacklist Access Token)
    const sessionDataRaw = await this.redis.get(sessionKey);
    
    if (sessionDataRaw) {
      const sessionData = JSON.parse(sessionDataRaw);
      
      // 2. ถ้ามี jti ให้ส่งเข้า Blacklist ตามเวลาที่เหลือของ Access Token
      if (sessionData.jti) {
        const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
        const ttl = parseInt(accessTokenExpiresIn, 10) * 60; // แปลงนาทีเป็นวินาที
        
        await this.redis.set(`blacklist:${sessionData.jti}`, 'revoked', 'EX', ttl);
      }
    }

    // 3. ลบ Session และลบ ID ออกจาก Index Set ของ User
    const [deletedCount] = await Promise.all([
      this.redis.del(sessionKey),
      this.redis.srem(userSessionsKey, sessionId)
    ]);

    this.logger.warn(`🚪 User ${userId} session ${sessionId} logout & jti blacklisted`, 'AuthService');
    
    return deletedCount > 0 ? { success: true } : { success: false };
  } catch (error) {
    this.logger.error(`❌🚪 Logout failed for user ${userId} session ${sessionId}`, error.stack, 'AuthService');
    throw new InternalServerErrorException('❌🚪 Logout failed');
  }
}

  private async logoutAllRedis(userId: string) {
    try {
      const userIndexKey = `user_sessions:${userId}`;
      
      // 1. ดึง sessionId ทั้งหมดที่ User นี้มีอยู่
      const sessionIds = await this.redis.smembers(userIndexKey);
      if (sessionIds.length === 0) return { success: true };

      const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
      const blacklistTTL = parseInt(accessTokenExpiresIn, 10) * 60; // แปลงนาทีเป็นวินาที

      for (const sessionId of sessionIds) {
        const sessionKey = `session:${sessionId}`;
        const data = await this.redis.get(sessionKey);
        
        if (data) {
          const session = JSON.parse(data);
          // 2. ถ้ามี jti ให้ส่งเข้า Blacklist (ฆ่า Access Token ทันที)
          if (session.jti) {
            await this.redis.set(`blacklist:${session.jti}`, 'revoked', 'EX', blacklistTTL);
          }
          // 3. ลบ Session data
          await this.redis.del(sessionKey);
        }
      }

      // 4. ลบตัว Index ทิ้ง
      await this.redis.del(userIndexKey);

      this.logger.warn(`🚪 User ${userId} logged out from all devices.`, 'AuthService');      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌🚪 LogoutAll error for ${userId}`, error.stack, 'AuthService');
      throw new InternalServerErrorException('❌🚪 Logout failed');
    }
  }

  /**
  * เพิ่ม Token (JTI) เข้า Blacklist ใน Redis
  * @param jti Unique ID ของ Token
  * @param exp เวลาหมดอายุของ Token (Unix Timestamp)
  */
  public async revoke(jti: string, exp: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    // ถ้า Token ยังไม่หมดอายุ ให้เก็บเข้า Blacklist ตามเวลาที่เหลือ
    if (ttl > 0) {
      // แก้ไข: ลบ } ที่เกินมา และใช้ prefix ที่ชัดเจน
      await this.redis.set(`blacklist:${jti}`, '1', 'EX', ttl);
      this.auth_logger.log(`🗑️ Token JTI: ${jti} has been blacklisted for ${ttl}s`, 'AuthService');
    }
  }
 
  
}

