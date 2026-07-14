import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

// เพิ่ม Class นี้ไว้ด้านบนของไฟล์ market-signal.entity.ts
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return data ? parseFloat(data) : null;
  }
}

@Entity('market_signals')
export class MarketSignal {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 20 })
  symbol: string;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true, transformer: new ColumnNumericTransformer() })
  last_close: number;

  @Column({ length: 250, nullable: true })
  signal: string;

  @Column({ length: 250, nullable: true })
  trend: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  rsi_14: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 70 })
  rsi_overbought: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 30 })
  rsi_oversold: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  ema_50: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  ema_200: number;

  @Column({ default: false })
  golden_cross: boolean;

  @Column({ default: false })
  death_cross: boolean;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

 
}



