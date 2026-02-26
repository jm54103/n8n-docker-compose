import { Controller, Get, Param, Query } from '@nestjs/common'; // อย่าลืม Import @Query
import { MarketSignalsService } from './market-signals.service';

@Controller('MarketSignals')
export class MarketSignalsController {
  constructor(private readonly service: MarketSignalsService) {}

  // 1. ดึงข้อมูลทั้งหมด (มีระบบ Pagination หรือ Filter เบื้องต้น)
  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  // 2. ดึงหุ้นที่เกิด Golden Cross เท่านั้น
  // เรียกใช้งานผ่าน: GET /signals/bullish
  @Get('bullish')
  async getBullish() {
    return await this.service.findBullish();
  }

  // 3. ดึงข้อมูลหุ้นรายตัว
  // เรียกใช้งานผ่าน: GET /signals/BTCUSDT
  @Get(':symbol')
  async getOne(@Param('symbol') symbol: string) {
    return await this.service.findBySymbol(symbol.toUpperCase());
  }
}