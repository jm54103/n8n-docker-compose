import { Module } from '@nestjs/common'; // ต้องเพิ่มบรรทัดนี้
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarketSignal } from "./entities/market-signal.entity";
import { MarketSignalsController } from "./market-signals.controller";
import { MarketSignalsService } from "./market-signals.service";

@Module({ 
  imports: [TypeOrmModule.forFeature([MarketSignal],"set100Connection")],
  controllers: [MarketSignalsController],
  providers: [MarketSignalsService],
  exports: [MarketSignalsService], // เผื่อ Module อื่นอยากดึงข้อมูล Signal ไปใช้
})
export class MarketSignalsModule {}