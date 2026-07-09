import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YahooFinanceTickerSymbolsCountry } from './entities/yahoo_finance_ticker_symbols_country.entity';

@Injectable()
export class YahooFinanceTickerSymbolsCountryService {
  constructor(
    @InjectRepository(YahooFinanceTickerSymbolsCountry,"set100Connection")
    private readonly symbolCountryRepository: Repository<YahooFinanceTickerSymbolsCountry>,
  ) {}

  /**
   * ดึงข้อมูลทั้งหมดในตาราง
   */
  async findAll(): Promise<YahooFinanceTickerSymbolsCountry[]> {    
    return await this.symbolCountryRepository.find({
      order: {
        country: 'ASC' // ใส่ชื่อ property ให้ตรงกับที่นิยามไว้ใน Entity ของคุณ
      }
    });
  }
 

  /**
   * ค้นหาข้อมูลด้วย Composite Primary Keys (Country)
   */
  async findOne(country: string): Promise<YahooFinanceTickerSymbolsCountry> {
    const item = await this.symbolCountryRepository.findOne({
      where: { country },
    });
    if (!item) {
      throw new NotFoundException(`Symbol with Country: ${country} not found`);
    }
    return item;
  }  
 
}