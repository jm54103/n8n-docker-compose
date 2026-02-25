import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CandleSticksService } from './candle-sticks.service';
import { CandleStick } from './entities/candle-stick.entity';

@ApiTags('CandleSticks') // กำหนดกลุ่มใน Swagger
@Controller('candle-sticks')
export class CandleSticksController {
  constructor(private readonly candleSticksService: CandleSticksService) {}

  @Get(':symbol')
  @ApiOperation({ summary: 'ดึงข้อมูลแท่งเทียนทั้งหมดตาม Symbol' })
  @ApiResponse({ status: 200, description: 'คืนค่ารายการแท่งเทียน', type: [CandleStick] })
  async findAll(@Param('symbol') symbol: string) {
    return await this.candleSticksService.findAllBySymbol(symbol.toUpperCase());
  }

  @Get(':symbol/range')
  @ApiOperation({ summary: 'ดึงข้อมูลแท่งเทียนตามช่วงวันที่' })  
  @ApiQuery({ name: 'start', example: '2026-01-01' })
  @ApiQuery({ name: 'end', example: '2026-02-23' })
  async findByRange(
    @Param('symbol') symbol: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {

    const startDate=new Date(start);
    const endDate=new Date(end);
    
    console.log(`${symbol} Searching between: ${start} and ${end}`);

    return await this.candleSticksService.findByDateRange(
      symbol,
      startDate,
      endDate,
    )
  }

  @Post()
  @ApiOperation({ summary: 'บันทึกข้อมูลแท่งเทียนใหม่' })
  @ApiResponse({ status: 201, description: 'บันทึกสำเร็จ' })
  async create(@Body() candleData: Partial<CandleStick>) {
    return await this.candleSticksService.create(candleData);
  }
}