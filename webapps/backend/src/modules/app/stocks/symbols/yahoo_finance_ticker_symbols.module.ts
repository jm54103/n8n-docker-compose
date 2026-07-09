import { Module } from '@nestjs/common'; // ต้องเพิ่มบรรทัดนี้
import { TypeOrmModule } from "@nestjs/typeorm";

import { YahooFinanceTickerSymbolsService } from './YahooFinanceTickerSymbolService.service';
import { YahooFinanceTickerSymbolController } from './yahool_finance_ticker_symbols.controller';
import { YahooFinanceTickerSymbols } from './entities/yahoo_finance_ticker_symbols';
import { YahooFinanceTickerSymbolsCountry } from './entities/yahoo_finance_ticker_symbols_country.entity';
import { YahooFinanceTickerSymbolsExchange } from './entities/yahoo_finance_ticker_symbols_exchange.entity';
import { YahooFinanceTickerSymbolsExchangeService } from './YahooFinanceTickerSymbolExchange.service';
import { YahooFinanceTickerSymbolsCountryService } from './YahooFinanceTickerSymbolCountry.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    YahooFinanceTickerSymbols,
    YahooFinanceTickerSymbolsCountry,
    YahooFinanceTickerSymbolsExchange
    ],"set100Connection")],
  providers: [YahooFinanceTickerSymbolsService,
    YahooFinanceTickerSymbolsCountryService,
    YahooFinanceTickerSymbolsExchangeService    
  ],
  controllers: [YahooFinanceTickerSymbolController], // ถ้ามี
})
export class YahooFinanceTickerSymbolModule {}