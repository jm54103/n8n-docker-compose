import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketSignalsModule } from './modules/market-signals/market-signals.module';
import { MarketSignal } from './entities/market-signal.entity';
import { CandleSticksModule } from './modules/candle-sticks/candle-sticks.module';
import { CandleStick } from './entities/candle-stick.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
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
      entities: [MarketSignal,CandleStick],
      synchronize: false, // สำคัญ: เพราะคุณสร้าง Table จาก SQL เองแล้ว ⚠️ production จริงควร false
    }),
    MarketSignalsModule, CandleSticksModule,
  ],
})


export class AppModule {}