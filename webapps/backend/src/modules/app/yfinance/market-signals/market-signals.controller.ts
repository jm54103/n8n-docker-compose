import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'; // อย่าลืม Import @Query
import { MarketSignalsService } from './market-signals.service';
/*--Guard--*/
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator'; 
import { Public } from 'src/common/decorators/public.decorator';



@Controller('MarketSignals')
export class MarketSignalsController {
  constructor(private readonly service: MarketSignalsService) {}

  // 1. ดึงข้อมูลทั้งหมด (มีระบบ Pagination หรือ Filter เบื้องต้น)
  @Get()
  @Public() 
  //@ApiBearerAuth('accessToken')
  //@UseGuards(JwtAuthGuard, PermissionsGuard)    
  async getAll() {
    return await this.service.findAll();
  }

  // 2. ดึงหุ้นที่เกิด Golden Cross เท่านั้น
  // เรียกใช้งานผ่าน: GET /signals/bullish
  @Get('bullish')
  @Public()
  //@ApiBearerAuth('accessToken')
  //@UseGuards(JwtAuthGuard, PermissionsGuard)
  async getBullish() {
    return await this.service.findBullish();
  }

  // 3. ดึงข้อมูลหุ้นรายตัว
  // เรียกใช้งานผ่าน: GET /signals/BTCUSDT
  @Get(':symbol')
  @Public()
  //@ApiBearerAuth('accessToken')
  //@UseGuards(JwtAuthGuard, PermissionsGuard)
  async getOne(@Param('symbol') symbol: string) {
    return await this.service.findBySymbol(symbol.toUpperCase());
  }
}