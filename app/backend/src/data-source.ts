import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./modules/sys/users/entities/user.entity" // เปลี่ยนเป็นชื่อ Entity ของคุณ
import { UserGroup } from "./modules/sys/user-groups/entities/user-group.entity";
import { UserAccessLog } from "./modules/sys/user-access-logs/entities/user-access-log.entity";
import { UserActivityLog } from "./modules/sys/user-activity-logs/entities/user-activity-log.entity";
import { SystemParameter } from "./modules/sys/system-parameters/entities/system-parameter.entity";
import { SystemPermission } from "./modules/sys/system-permissions/entities/system-permission.entity";

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