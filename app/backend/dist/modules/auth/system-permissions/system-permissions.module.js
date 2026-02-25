"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemPermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const system_permissions_service_1 = require("./system-permissions.service");
const system_permissions_controller_1 = require("./system-permissions.controller");
const system_permission_entity_1 = require("./entities/system-permission.entity");
let SystemPermissionsModule = class SystemPermissionsModule {
};
exports.SystemPermissionsModule = SystemPermissionsModule;
exports.SystemPermissionsModule = SystemPermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([system_permission_entity_1.SystemPermission]),
        ],
        controllers: [system_permissions_controller_1.SystemPermissionsController],
        providers: [system_permissions_service_1.SystemPermissionsService],
        exports: [system_permissions_service_1.SystemPermissionsService],
    })
], SystemPermissionsModule);
//# sourceMappingURL=system-permissions.module.js.map