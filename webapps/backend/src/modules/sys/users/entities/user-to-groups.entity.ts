import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserGroup } from "../../user-groups/entities/user-group.entity";
import { User } from "./user.entity";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity('user_to_groups')
export class UserToGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => User, (user) => user.groups)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiHideProperty()
  @ManyToOne(() => UserGroup, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: UserGroup;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy: string;
}