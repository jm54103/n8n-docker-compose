import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/* ===== Stocks ===== */
import { MarketSignalsModule } from './modules/app/stocks/market-signals/market-signals.module';
import { MarketSignal } from './modules/app/stocks/market-signals/entities/market-signal.entity';
import { CandleSticksModule } from './modules/app/stocks/candle-sticks/candle-sticks.module';
import { CandleStick } from './modules/app/stocks/candle-sticks/entities/candle-stick.entity';

/* ===== System ===== */
import { SystemParametersModule } from './modules/sys/system-parameters/system-parameters.module';
import { SystemParameter } from './modules/sys/system-parameters/entities/system-parameter.entity';
import { SystemPermissionsModule } from './modules/sys/system-permissions/system-permissions.module';
import { SystemPermission } from './modules/sys/system-permissions/entities/system-permission.entity';

/* ===== Users ===== */
import { UsersModule } from './modules/sys/users/users.module';
import { User } from './modules/sys/users/entities/user.entity';
import { UserGroupsModule } from './modules/sys/user-groups/user-groups.module';
import { UserGroup } from './modules/sys/user-groups/entities/user-group.entity';

/* ===== Auth ===== */
import { AuthModule } from './modules/sys/auth/auth.module';
import { UserSession } from './modules/sys/auth/entities/user-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [
        MarketSignal,
        CandleStick,
        SystemParameter,
        SystemPermission,
        User,
        UserGroup,
        UserSession,
      ],
      synchronize: false, // production = false
    }),

    /* Modules */
    MarketSignalsModule,
    CandleSticksModule,
    SystemParametersModule,
    SystemPermissionsModule,
    UsersModule,
    UserGroupsModule,
    AuthModule,
  ],
})
export class AppModule {}