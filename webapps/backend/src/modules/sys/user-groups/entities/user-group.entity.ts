import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserGroupPermission } from './user-group-permission.entity';
import { ApiHideProperty } from '@nestjs/swagger';

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

  @ApiHideProperty()
  @OneToMany(() => User, (user) => user.group) 
  users: User[];

  // ✅ ต้องระบุชื่อฟิลด์ฝั่งลูก (ugp => ugp.userGroup) ให้ตรงเป๊ะ
  @ApiHideProperty()
  @OneToMany(() => UserGroupPermission, (ugp) => ugp.userGroup) 
  userGroupPermissions: UserGroupPermission[];
}
