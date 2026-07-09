import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YahooFinanceTickerSymbolsExchange } from './entities/yahoo_finance_ticker_symbols_exchange.entity';

@Injectable()
export class YahooFinanceTickerSymbolsExchangeService {
  constructor(
    @InjectRepository(YahooFinanceTickerSymbolsExchange,"set100Connection")
    private readonly symbolExchangeRepository: Repository<YahooFinanceTickerSymbolsExchange>,
  ) {}

 /**
 * ดึงข้อมูลทั้งหมดในตาราง เรียงตาม Country และ Exchange (ASC)
 */
  async findAll(): Promise<YahooFinanceTickerSymbolsExchange[]> {
   return await this.symbolExchangeRepository.find({
    order: {
      country: 'ASC',
      exchange: 'ASC'
    }
   });
 }

  /**
   * ค้นหาข้อมูลด้วย Composite Primary Keys (Exchange,Country)
   */
  async findOne(exchange: string, country: string): Promise<YahooFinanceTickerSymbolsExchange> {
    const item = await this.symbolExchangeRepository.findOne({
      where: { exchange, country },
    });
    if (!item) {
      throw new NotFoundException(`Symbol with Exchange: ${exchange} and Country: ${country} not found`);
    }
    return item;
  }  
 
}