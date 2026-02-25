import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandleStick } from './entities/candle-stick.entity';
import { CandleSticksController } from './candle-sticks.controller';
import { CandleSticksService } from './candle-sticks.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandleStick])], // <--- ใส่ตรงนี้
  controllers: [CandleSticksController],
  providers: [CandleSticksService],
  exports: [CandleSticksService], // เผื่อ Module อื่นอยากดึงข้อมูล Signal ไปใช้
})
export class CandleSticksModule {}
