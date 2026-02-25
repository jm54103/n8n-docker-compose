import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { UserGroup } from '../../user-groups/entities/user-group.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    userId: string;
  
    @Column({ unique: true, length: 50 })
    username: string;
  
    @Column({ unique: true, length: 100 })
    email: string;
  
    @Column({ name: 'password_hash', select: false }) // select: false เพื่อไม่ให้ดึง hash ออกมาตอน query ปกติ (Security)
    passwordHash: string;
  
    @ManyToOne(() => UserGroup, (group) => group.users, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'group_id' })
    group: UserGroup;
  
    @Column({ name: 'group_id', nullable: true })
    groupId: number;
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @Column({ default: 'ACTIVE', length: 20 })
    status: string;
  
    @Column({ name: 'is_logged_in', default: false })
    isLoggedIn: boolean;
  
    @Column({ name: 'session_key', type: 'text', nullable: true })
    sessionKey: string;
  
    @Column({ name: 'login_attempts', default: 0 })
    loginAttempts: number;
  
    @Column({ name: 'lock_until', type: 'timestamptz', nullable: true })
    lockUntil: Date;
  
    @Column({ name: 'last_login', type: 'timestamptz', nullable: true })
    lastLogin: Date;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }