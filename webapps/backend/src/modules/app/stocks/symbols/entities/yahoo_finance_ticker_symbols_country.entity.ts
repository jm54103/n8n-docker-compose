import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity({ name: 'yahoo_finance_ticker_symbols_country', schema: 'public' })
export class YahooFinanceTickerSymbolsCountry {
  
  // เนื่องจากใน DDL เดิมไม่ได้กำหนด PRIMARY KEY แต่กำหนด UNIQUE INDEX ไว้
  // หากคุณต้องการให้คอลัมน์นี้เป็น Key หลักในโค้ด สามารถใช้ @PrimaryColumn() ได้เลยครับ
  @PrimaryColumn({ name: 'Country', type: 'varchar', length: 50 })
  country: string;
}