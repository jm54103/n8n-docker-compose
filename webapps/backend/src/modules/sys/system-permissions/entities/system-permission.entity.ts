import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserGroup } from '../../user-groups/entities/user-group.entity';

@Entity('system_permissions')
export class SystemPermission {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'permission_key', unique: true, length: 100 })
  permissionKey: string; // เช่น 'sys.user.edit'

  @Column({ name: 'permission_name', length: 100 })
  permissionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

}