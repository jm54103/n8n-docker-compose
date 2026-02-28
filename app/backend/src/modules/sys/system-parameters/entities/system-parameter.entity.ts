import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('system_parameters')
export class SystemParameter {
  @PrimaryGeneratedColumn({ name: 'param_id' })
  paramId: number;

  @Column({ name: 'param_key', unique: true, length: 100 })
  paramKey: string;

  @Column({ name: 'param_value', type: 'text' })
  paramValue: string;

  @Column({ name: 'value_type', length: 20, default: 'INT' })
  valueType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Helper Method สำหรับแปลงค่าออกมาตาม Type
  getTypedValue(): string | number | boolean {
    switch (this.valueType) {
      case 'INT':
        return parseInt(this.paramValue, 10);
      case 'BOOL':
        return this.paramValue.toLowerCase() === 'true';
      default:
        return this.paramValue;
    }
  }
}