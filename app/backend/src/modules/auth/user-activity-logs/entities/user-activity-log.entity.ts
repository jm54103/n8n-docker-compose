//ตรวจสอบความปลอดภัยในการบันทึกการเปลี่ยนแปลง (Audit Trail)

//ใน NestJS คุณสามารถสร้าง Interceptor หรือใช้ TypeORM Subscriber ดักจับเฉพาะฟิลด์ที่ระบุไว้ใน List เพื่อทำ Log อัตโนมัติได้
//เพื่อให้ Service ของคุณไม่ต้องเขียนโค้ด Log ซ้ำๆ ในทุกฟังก์ชัน

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_activity_logs')
export class UserActivityLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'activity_id' })
  activityId: string;

  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ name: 'action_type', length: 50 })
  actionType: string; // เช่น 'UPDATE_USER_STATUS', 'CHANGE_PERMISSION'

  @Column({ name: 'target_table', length: 50, nullable: true })
  targetTable: string;

  @Column({ name: 'target_id', type: 'uuid', nullable: true })
  targetId: string;

  @Column({ type: 'jsonb', name: 'old_value', nullable: true })
  oldValue: any;

  @Column({ type: 'jsonb', name: 'new_value', nullable: true })
  newValue: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}