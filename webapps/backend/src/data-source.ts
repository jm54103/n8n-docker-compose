import "reflect-metadata"
import { DataSource } from "typeorm"
// เปลี่ยนเป็นชื่อ Entity ของคุณ
import { User } from "./modules/sys/users/entities/user.entity" 
import { UserGroup } from "./modules/sys/user-groups/entities/user-group.entity";
import { UserGroupPermission } from "./modules/sys/user-groups/entities/user-group-permission.entity";
import { UserSession } from "./modules/sys/auth/entities/user-session.entity"; 
import { UserAccessLog } from "./modules/sys/user-access-logs/entities/user-access-log.entity";
import { UserActivityLog } from "./modules/sys/user-activity-logs/entities/user-activity-log.entity";
import { SystemParameter } from "./modules/sys/system-parameters/entities/system-parameter.entity";
import { SystemPermission } from "./modules/sys/system-permissions/entities/system-permission.entity";
import { UserToGroup } from "./modules/sys/users/entities/user-to-groups.entity";

export const AppDataSource = new DataSource({
    type: "postgres", // หรือ mysql, mariadb, sqlite ตามที่ใช้จริง
    host: "localhost",
    port: 5432,
    username: "n8n",
    password: "n8npass",
    database: "auth",
    synchronize: true, // false สำหรับ production
    logging: true,
    entities: [User,UserToGroup,UserGroup,UserGroupPermission,UserSession,UserAccessLog,UserActivityLog,SystemParameter,SystemPermission], // หรือใช้ path ["src/entity/*.ts"]
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
})