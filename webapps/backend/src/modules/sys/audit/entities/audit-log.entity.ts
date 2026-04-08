import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  entityId: number;

  @Column()
  action: string; // 'UPDATE'

  @Column({ type: 'jsonb', nullable: true })
  oldData: any;

  @Column({ type: 'jsonb', nullable: true })
  newData: any;

  @Column({ nullable: true })
  changedBy: string; // เก็บ ID หรือ Username ของคนแก้

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}