import { Controller, Get, Query } from '@nestjs/common';
import { SettradeService } from './settrade.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('settrade')
export class SettradeController {
  constructor(private readonly settradeService: SettradeService) {}

  @Get('token')
  @Public() 
  async getAccessToken() {
    return await this.settradeService.getAccessToken();
  }

  @Get('quote')
  @Public() 
  async getQuote(@Query('symbol') symbol: string) {
    return await this.settradeService.getSymbolQuote(symbol);
  }

  // เพิ่ม Method นี้เข้าไปในคลาส SettradeController ของคุณ
  @Get('symbols')
  @Public() 
  async getAllSymbols() {
    return await this.settradeService.getAllSymbols();
  }

  // ดึงข้อมูลดัชนี (เช่น /market/indices หรือ /market/indices?index=SET50)
  @Get('indices')
  @Public() 
  async getIndices(@Query('index') index?: string) {
    return await this.settradeService.getMarketIndices(index);
  }

  // ดึงข้อมูลประเภทธุรกิจ/กลุ่มอุตสาหกรรม (/market/sectors)
  @Get('sectors')
  @Public() 
  async getSectors() {
    return await this.settradeService.getSectorsAndIndustries();
  }
}