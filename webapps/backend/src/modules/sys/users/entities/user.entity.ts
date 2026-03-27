import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { UserGroup } from '../../user-groups/entities/user-group.entity';
import { ApiHideProperty } from '@nestjs/swagger';
  
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


    @ApiHideProperty()
    @ManyToMany(() => UserGroup, (group) => group.users, { cascade: true })
    @JoinTable({
      name: 'user_to_groups', // ชื่อ Table กลาง
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'userId',
      },
      inverseJoinColumn: {
        name: 'group_id',
        referencedColumnName: 'groupId',
      },
    })
    groups: UserGroup[];

  
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

    @Column({ name: 'created_by', length: 100, nullable: true })
    createdBy: string;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'updated_by', length: 100, nullable: true })
    updatedBy: string;


  }