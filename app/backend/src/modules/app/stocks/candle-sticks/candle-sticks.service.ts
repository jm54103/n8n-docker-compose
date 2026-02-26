import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CandleStick } from './entities/candle-stick.entity';

@Injectable()
export class CandleSticksService {
  constructor(
    @InjectRepository(CandleStick)
    private readonly candleRepository: Repository<CandleStick>,
  ) {}

  // 1. ดึงข้อมูลทั้งหมดของ Symbol หนึ่งๆ (เช่น BTC/USDT)
  async findAllBySymbol(symbol: string): Promise<CandleStick[]> {
    return await this.candleRepository.find({
      where: { symbol },
      order: { x: 'ASC' }, // เรียงตามวันที่จากเก่าไปใหม่
    });
  }

  // 2. ดึงข้อมูลแบบระบุช่วงวันที่ (Date Range)
  async findByDateRange(symbol: string, startDate: Date, endDate: Date): Promise<CandleStick[]> {
    console.log('symbol:'+symbol);
    return await this.candleRepository.find({
      where: { 
        symbol,
        x : Between(startDate,endDate)
      },
      order: { x: 'ASC' },
    });
  }

  // 3. บันทึกข้อมูลแท่งเทียนใหม่
  async create(data: Partial<CandleStick>): Promise<CandleStick> {
    const newCandle = this.candleRepository.create(data);
    return await this.candleRepository.save(newCandle);
  }

  // 4. ลบข้อมูล (ถ้าจำเป็น)
  async remove(symbol: string, x: Date): Promise<void> {
    await this.candleRepository.delete({ symbol, x });
  }
}