"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./modules/sys/users/entities/user.entity");
const user_group_entity_1 = require("./modules/sys/user-groups/entities/user-group.entity");
const user_access_log_entity_1 = require("./modules/sys/user-access-logs/entities/user-access-log.entity");
const user_activity_log_entity_1 = require("./modules/sys/user-activity-logs/entities/user-activity-log.entity");
const system_parameter_entity_1 = require("./modules/sys/system-parameters/entities/system-parameter.entity");
const system_permission_entity_1 = require("./modules/sys/system-permissions/entities/system-permission.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "n8n",
    password: "n8npass",
    database: "auth",
    synchronize: false,
    logging: true,
    entities: [user_entity_1.User, user_group_entity_1.UserGroup, user_access_log_entity_1.UserAccessLog, user_activity_log_entity_1.UserActivityLog, system_parameter_entity_1.SystemParameter, system_permission_entity_1.SystemPermission],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map