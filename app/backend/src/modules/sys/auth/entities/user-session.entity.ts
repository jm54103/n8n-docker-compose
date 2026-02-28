import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column()
  userId: string;

  @Column()
  refreshTokenHash: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  deviceInfo: string;

  @CreateDateColumn()
  createdAt: Date;
}