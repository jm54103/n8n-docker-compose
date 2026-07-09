import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YahooFinanceTickerSymbols } from './entities/yahoo_finance_ticker_symbols';

@Injectable()
export class YahooFinanceTickerSymbolsService {
  constructor(
    @InjectRepository(YahooFinanceTickerSymbols,"set100Connection")
    private readonly symbolRepository: Repository<YahooFinanceTickerSymbols>,
  ) {}

  /**
   * ดึงข้อมูลทั้งหมดในตาราง
   */
  async findAll(): Promise<YahooFinanceTickerSymbols[]> {
    return await this.symbolRepository.find();
  }

  /**
   * ค้นหาข้อมูลด้วย Composite Primary Keys (Ticker, Name, Country)
   */
  async findOne(ticker: string, name: string, country: string): Promise<YahooFinanceTickerSymbols> {
    const symbol = await this.symbolRepository.findOne({
      where: { ticker, name, country },
    });

    if (!symbol) {
      throw new NotFoundException(`Symbol with Ticker: ${ticker}, Name: ${name}, Country: ${country} not found`);
    }

    return symbol;
  }

  /**
   * ค้นหาข้อมูลตาม Ticker อย่างเดียว (อาจได้ผลลัพธ์มากกว่า 1 รายการ)
   */
  async findByTicker(ticker: string): Promise<YahooFinanceTickerSymbols[]> {
    return await this.symbolRepository.find({
      where: { ticker },
    });
  }

  /**
   * สร้างหรือบันทึกข้อมูลใหม่
   */
  async create(data: Partial<YahooFinanceTickerSymbols>): Promise<YahooFinanceTickerSymbols> {
    const newSymbol = this.symbolRepository.create(data);
    return await this.symbolRepository.save(newSymbol);
  }

  /**
   * อัปเดตข้อมูล (เนื่องจากเป็น Composite Key จำเป็นต้องระบุเงื่อนไขให้ครบ 3 คอลัมน์)
   */
  async update(
    ticker: string,
    name: string,
    country: string,
    updateData: Partial<Omit<YahooFinanceTickerSymbols, 'ticker' | 'name' | 'country'>>,
  ): Promise<YahooFinanceTickerSymbols> {
    const symbol = await this.findOne(ticker, name, country);
    
    // อัปเดตค่าใหม่เข้าไปใน entity ตัวเดิม
    Object.assign(symbol, updateData);
    
    return await this.symbolRepository.save(symbol);
  }

  /**
   * ลบข้อมูลโดยใช้ Composite Keys
   */
  async remove(ticker: string, name: string, country: string): Promise<void> {
    const result = await this.symbolRepository.delete({ ticker, name, country });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Cannot delete. Symbol not found.`);
    }
  }
}