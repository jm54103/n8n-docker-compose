import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketSignalsModule } from './modules/market-signals/market-signals.module';
import { MarketSignal } from './modules/market-signals/entities/market-signal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // หรือใส่ IP ของ DB คุณ
      port: 5432,
      username: 'n8n',
      password: 'n8npass',
      database: 'set100',
      entities: [MarketSignal],
      synchronize: false, // สำคัญ: เพราะคุณสร้าง Table จาก SQL เองแล้ว
    }),
    MarketSignalsModule,
  ],
})
export class AppModule {}