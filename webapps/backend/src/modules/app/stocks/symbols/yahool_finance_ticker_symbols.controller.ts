import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { YahooFinanceTickerSymbolsService } from './YahooFinanceTickerSymbolService.service';
import { YahooFinanceTickerSymbolsExchangeService } from './YahooFinanceTickerSymbolExchange.service';
import { YahooFinanceTickerSymbolsCountryService } from './YahooFinanceTickerSymbolCountry.service';
import { YahooFinanceTickerSymbols } from './entities/yahoo_finance_ticker_symbols';
import { YahooFinanceTickerSymbolsCountry } from './entities/yahoo_finance_ticker_symbols_country.entity';
import { YahooFinanceTickerSymbolsExchange } from './entities/yahoo_finance_ticker_symbols_exchange.entity';

@Controller('symbols')
export class YahooFinanceTickerSymbolController {
  constructor(
    private readonly symbolService: YahooFinanceTickerSymbolsService,
    private readonly symbolExchangeService: YahooFinanceTickerSymbolsExchangeService,
    private readonly symbolCountryService: YahooFinanceTickerSymbolsCountryService,
  ) {}

  /**
   * POST /symbols
   * สร้างข้อมูลใหม่
   */
  @Post()
  async create(@Body() createData: Partial<YahooFinanceTickerSymbols>): Promise<YahooFinanceTickerSymbols> {
    return await this.symbolService.create(createData);
  }

  /**
   * GET /symbols
   * ดึงข้อมูลทั้งหมด
   */
  @Get()  
  async findAll(): Promise<YahooFinanceTickerSymbols[]> {
    return await this.symbolService.findAll();
  }

  @Get('findByExchangeCountry')
  @Public() 
  async findByExchangeCountry(
    @Query('exchanges') exchanges: string[]  
  ): Promise<YahooFinanceTickerSymbolsCountry[]> {
    return await this.symbolService.findByExchanges(exchanges) 
  }

  
  @Get('country')
  @Public() 
  async findAllCountry(): Promise<YahooFinanceTickerSymbolsCountry[]> {
    return await this.symbolCountryService.findAll();
  }

   
  @Get('exchange')
  @Public() 
  async findAllExchange(): Promise<YahooFinanceTickerSymbolsExchange[]> {
    return await this.symbolExchangeService.findAll();
  }

  /**
   * GET /symbols/search?ticker=AAPL
   * ค้นหาตาม Ticker อย่างเดียว (อาจเจอมากกว่า 1 รายการ)
   */
  @Get('search')
  @Public()
  async findByTicker(@Query('ticker') ticker: string): Promise<YahooFinanceTickerSymbols[]> {
    return await this.symbolService.findByTicker(ticker);
  }

  /**
   * GET /symbols/detail?ticker=AAPL&name=Apple%20Inc.&country=USA
   * ดึงข้อมูลเจาะจง 1 แถวด้วย Composite Keys
   */
  @Get('detail')
  @Public() 
  async findOne(
    @Query('ticker') ticker: string,
    @Query('name') name: string,
    @Query('country') country: string,
  ): Promise<YahooFinanceTickerSymbols> {
    return await this.symbolService.findOne(ticker, name, country);
  }

  /**
   * PATCH /symbols?ticker=AAPL&name=Apple%20Inc.&country=USA
   * อัปเดตข้อมูล (แก้ไขเฉพาะ Exchange หรือ CategoryName)
   */
  @Patch()
  async update(
    @Query('ticker') ticker: string,
    @Query('name') name: string,
    @Query('country') country: string,
    @Body() updateData: Partial<YahooFinanceTickerSymbols>,
  ): Promise<YahooFinanceTickerSymbols> {
    return await this.symbolService.update(ticker, name, country, updateData);
  }

  /**
   * DELETE /symbols?ticker=AAPL&name=Apple%20Inc.&country=USA
   * ลบข้อมูลด้วย Composite Keys
   */
  @Delete()
  async remove(
    @Query('ticker') ticker: string,
    @Query('name') name: string,
    @Query('country') country: string,
  ): Promise<{ message: string }> {
    await this.symbolService.remove(ticker, name, country);
    return { message: 'Symbol deleted successfully' };
  }
}