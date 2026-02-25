import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SystemPermission } from '../../system-permissions/entities/system-permission.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  groupId: number; // Mapping อัตโนมัติกับ group_id (Serial)

  @Column({ name: 'group_name', unique: true, length: 50 })
  groupName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => User, (user) => user.group)
  users: User[];

  permissions: SystemPermission[];
}