import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { SystemPermission } from '../../system-permissions/entities/system-permission.entity';
import { UserGroup } from './user-group.entity';
@Entity('user_group_permissions')
export class UserGroupPermission {
    @PrimaryGeneratedColumn()
    userGroupPermissionId
    @Column({ name: 'permission_id' })
    permissionId: number;          
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;    
    @Column({ name: 'created_by', length: 100, nullable: true })
    createdBy: string;      
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;    
    @Column({ name: 'updated_by', length: 100, nullable: true })
    updatedBy: string;
    // ✅ 1. เชื่อมกลับไปหา UserGroup (ตารางแม่)
    @ManyToOne(() => UserGroup, (group) => group.userGroupPermissions)
    @JoinColumn({ name: 'user_group_id' }) // สำคัญ: ต้องตรงกับ column ใน DB
    userGroup: UserGroup; 

    // ✅ 2. เชื่อมไปหา SystemPermission (ตารางสิทธิ์)
    @ManyToOne(() => SystemPermission)
    @JoinColumn({ name: 'permission_id' })
    systemPermission: SystemPermission;

}