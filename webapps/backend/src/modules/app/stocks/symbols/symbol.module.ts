import { Module } from '@nestjs/common'; // ต้องเพิ่มบรรทัดนี้
import { TypeOrmModule } from "@nestjs/typeorm";
import { YahooFinanceTickerSymbol } from './entities/yahoo_finance_ticker_symbols';
import { YahooFinanceTickerSymbolService } from './symbol.service';
import { YahooFinanceTickerSymbolController } from './symbol.controller';

@Module({
  imports: [TypeOrmModule.forFeature([YahooFinanceTickerSymbol],"set100Connection")],
  providers: [YahooFinanceTickerSymbolService],
  controllers: [YahooFinanceTickerSymbolController], // ถ้ามี
})
export class YahooFinanceTickerSymbolModule {}