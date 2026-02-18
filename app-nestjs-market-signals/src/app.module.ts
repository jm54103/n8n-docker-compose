import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketSignalsModule } from './modules/market-signals/market-signals.module';
import { MarketSignal } from './entities/market-signal.entity';
import { CandleSticksModule } from './modules/candle-sticks/candle-sticks.module';
import { CandleStick } from './entities/candle-stick.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // หรือใส่ IP ของ DB คุณ
      port: 5432,
      username: 'n8n',
      password: 'n8npass',
      database: 'set100',
      entities: [MarketSignal,CandleStick],
      synchronize: false, // สำคัญ: เพราะคุณสร้าง Table จาก SQL เองแล้ว
    }),
    MarketSignalsModule, CandleSticksModule,
  ],
})
export class AppModule {}