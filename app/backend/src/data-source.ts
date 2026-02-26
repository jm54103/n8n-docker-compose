import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./modules/auth/users/entities/user.entity" // เปลี่ยนเป็นชื่อ Entity ของคุณ
import { UserGroup } from "./modules/auth/user-groups/entities/user-group.entity";
import { UserAccessLog } from "./modules/auth/user-access-logs/entities/user-access-log.entity";
import { UserActivityLog } from "./modules/auth/user-activity-logs/entities/user-activity-log.entity";
import { SystemParameter } from "./modules/auth/system-parameters/entities/system-parameter.entity";
import { SystemPermission } from "./modules/auth/system-permissions/entities/system-permission.entity";

export const AppDataSource = new DataSource({
    type: "postgres", // หรือ mysql, mariadb, sqlite ตามที่ใช้จริง
    host: "localhost",
    port: 5432,
    username: "n8n",
    password: "n8npass",
    database: "auth",
    synchronize: false, // ปิดไว้เพื่อให้ Migration ทำงานแทน
    logging: true,
    entities: [User,UserGroup,UserAccessLog,UserActivityLog,SystemParameter,SystemPermission], // หรือใช้ path ["src/entity/*.ts"]
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
})