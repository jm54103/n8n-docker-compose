"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./modules/auth/users/entities/user.entity");
const user_group_entity_1 = require("./modules/auth/user-groups/entities/user-group.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "n8n",
    password: "n8npass",
    database: "set100",
    synchronize: false,
    logging: true,
    entities: [user_entity_1.User, user_group_entity_1.UserGroup],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map