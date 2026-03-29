import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config/dist/config.service';
import { AuthLogger } from './auth.logger';


import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis'; // นำเข้า Redis
import { ConfigModule } from '@nestjs/config';         // นำเข้า Config
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from '../users/entities/user.entity';
import { UserGroup } from '../user-groups/entities/user-group.entity';
import { UserSession } from './entities/user-session.entity';
import { SystemParameter } from './../system-parameters/entities/system-parameter.entity';
import { SystemPermission } from '../system-permissions/entities/system-permission.entity';



import 'winston-daily-rotate-file';
import { UsersModule } from '../users/users.module';
import { SystemParametersModule } from '../system-parameters/system-parameters.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthLogger, JwtStrategy],
  imports: [   
    UsersModule,
    SystemParametersModule,
    TypeOrmModule.forFeature([User,UserGroup,UserSession,SystemParameter,SystemPermission]),            
    PassportModule,    
    RedisModule, // <--- ต้องใส่ตัวนี้ (เพื่อให้ Inject @InjectRedis() ได้)
    ConfigModule, // <--- ต้องใส่ตัวนี้ (เพื่อให้ Inject ConfigService ได้)
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