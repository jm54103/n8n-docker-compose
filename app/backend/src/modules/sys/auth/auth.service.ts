
import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SystemParameter } from "../system-parameters/entities/system-parameter.entity";
import { UserSession } from "./entities/user-session.entity";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(SystemParameter)
    private readonly paramRepo: Repository<SystemParameter>,
    
    private readonly jwtService: JwtService,
  ) {}

  private async getParam(key: string): Promise<number> {
    const param = await this.paramRepo.findOne({ where: { paramKey: key } });
    return param.getTypedValue() as number;
  }

  async login(user: LoginDto, deviceInfo: string) {
    const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');

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

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.sessionRepo.save(session);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
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

  async logout(sessionId: string) {
    let session=await this.sessionRepo.update(
      { sessionId },
      { isActive: false },
    );
    return (session==null) ? undefined : { success: true };
  }

  async logoutAll(userId: string) {
    let session=await this.sessionRepo.update(
      { userId },
      { isActive: false },
    );
    return (session==null) ? undefined : { success: true };
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

