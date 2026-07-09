import { Entity, Column, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'yahoo_finance_ticker_symbols_exchange', schema: 'public' })
@Unique('yahoo_finance_ticker_symbols_exchange_country_idx', ['country', 'exchange'])
export class YahooFinanceTickerSymbolsExchange {

  // ใน TypeORM แนะนำให้ตั้งคอลัมน์ที่เป็น Composite Index เป็น PrimaryColumn 
  // เพื่อให้ง่ายต่อการทำ Data Mapping และจัดระเบียบข้อมูล
  @PrimaryColumn({ name: 'Exchange', type: 'varchar', length: 50})
  exchange: string;

  @PrimaryColumn({ name: 'Country', type: 'varchar', length: 50 })
  country: string;
}