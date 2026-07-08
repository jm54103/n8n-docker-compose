import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'yahoo_finance_ticker_symbols', schema: 'public' })
@Index('yahoo_finance_ticker_symbols_ticker_idx', ['ticker', 'name', 'country'], { unique: true })
export class YahooFinanceTickerSymbol {

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'Ticker' })
  ticker: string;

  @PrimaryColumn({ type: 'varchar', length: 250, name: 'Name' })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'Exchange', nullable: true })
  exchange: string | null;

  @Column({ type: 'varchar', length: 50, name: 'CategoryName', nullable: true })
  categoryName: string | null;

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'Country' })
  country: string;
}