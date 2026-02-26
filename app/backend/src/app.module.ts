import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketSignalsModule } from './modules/app/stocks/market-signals/market-signals.module';
import { MarketSignal } from './modules/app/stocks/market-signals/entities/market-signal.entity';
import { CandleSticksModule } from './modules/app/stocks/candle-sticks/candle-sticks.module';
import { CandleStick } from './modules/app/stocks/candle-sticks/entities/candle-stick.entity';

/*--system--*/
import { SystemParametersModule } from './modules/auth/system-parameters/system-parameters.module';
import { SystemParameter } from './modules/auth/system-parameters/entities/system-parameter.entity';
import { SystemPermissionsModule } from './modules/auth/system-permissions/system-permissions.module';
import { SystemPermission } from './modules/auth/system-permissions/entities/system-permission.entity';
/*--system--*/

/*--user,usergroup--*/
import { UsersModule } from './modules/auth/users/users.module';
import { User } from './modules/auth/users/entities/user.entity';
import { UserGroupsModule } from './modules/auth/user-groups/user-groups.module';
import { UserGroup } from './modules/auth/user-groups/entities/user-group.entity';
/*--user,usergroup--*/





@Module({
  imports: [
    ConfigModule.forRoot({     
      // ถ้า NODE_ENV เป็น production ให้โหลด .env.production 
      // ถ้าไม่ใช่ ให้โหลด .env.development
      envFilePath: process.env.NODE_ENV === 'production' 
        ? '.env.production' 
        : '.env.development',
      isGlobal: true,          
    }  
    ),    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,     
      entities: [MarketSignal,CandleStick,SystemParameter,SystemPermission,User,UserGroup],
      synchronize: false, // สำคัญ: เพราะคุณสร้าง Table จาก SQL เองแล้ว ⚠️ production จริงควร false
    }),
    MarketSignalsModule,
    CandleSticksModule,
    SystemParametersModule,
    SystemPermissionsModule,
    UsersModule,
    UserGroupsModule
  ],
})


export class AppModule {}