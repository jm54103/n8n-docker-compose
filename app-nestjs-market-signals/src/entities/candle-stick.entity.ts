import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'candle_sticks', schema: 'public' })
export class CandleStick {
  
  @PrimaryColumn({ type: 'varchar' })
  symbol: string;

  @PrimaryColumn({ type: 'date' })
  x: Date; // วันที่ (Date)

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  o: number; // Open

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  h: number; // High

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  l: number; // Low

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  c: number; // Close
}