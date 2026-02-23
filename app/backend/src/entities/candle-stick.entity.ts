import { Entity, Column, PrimaryColumn, Double, Long } from 'typeorm';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export class DateToNumberTransformer {
  // ก่อนบันทึกลง DB (ไม่ส่งผลต่อข้อมูลเดิม)
  to(data: Date): Date {
    return data;
  }
  // เมื่อดึงข้อมูลออกมาจาก DB
  from(data: string | Date): number {
    return new Date(data).getTime(); // แปลงเป็น Timestamp (ms)
  }
}


@Entity({ name: 'candle_sticks', schema: 'public' })
export class CandleStick {
  
  @PrimaryColumn({ type: 'varchar' })
  symbol: string;

  @PrimaryColumn({ type: 'date', transformer: new DateToNumberTransformer()})
  x: Date; // วันที่ (Date)

  @Column({ type: 'numeric', precision: 18, scale: 8, transformer: new ColumnNumericTransformer() })
  o: number; // Open

  @Column({ type: 'numeric', precision: 18, scale: 8, transformer: new ColumnNumericTransformer() })
  h: number; // High

  @Column({ type: 'numeric', precision: 18, scale: 8, transformer: new ColumnNumericTransformer() })
  l: number; // Low

  @Column({ type: 'numeric', precision: 18, scale: 8, transformer: new ColumnNumericTransformer() })
  c: number; // Close

  @Column({ type: 'numeric', precision: 18, scale: 8, transformer: new ColumnNumericTransformer() })
  v: number; // volume
}

