import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';

import { User } from '../users/entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { SystemParameter } from './../system-parameters/entities/system-parameter.entity';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User,UserSession,SystemParameter]),
    PassportModule,
    // เปลี่ยนจาก register เป็น registerAsync
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // ดึงค่าผ่าน ConfigService
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
})
export class AuthModule {}