//บันทึกประวัติการเข้าใช้งานระบบ (Audit Log)
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_access_logs')
export class UserAccessLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'access_id' })
  accessId: string; // ใช้ string สำหรับ bigint

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'action_type', length: 50 })
  actionType: string; // 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'LOCKOUT'

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'session_id', type: 'text', nullable: true })
  sessionId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}