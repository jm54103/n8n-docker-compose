"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermission = void 0;
const typeorm_1 = require("typeorm");
const user_group_entity_1 = require("./user-group.entity");
let UserPermission = class UserPermission {
};
exports.UserPermission = UserPermission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'permission_id' }),
    __metadata("design:type", Number)
], UserPermission.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permission_key', unique: true, length: 100 }),
    __metadata("design:type", String)
], UserPermission.prototype, "permissionKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permission_name', length: 100 }),
    __metadata("design:type", String)
], UserPermission.prototype, "permissionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserPermission.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_group_entity_1.UserGroup, (group) => group.permissions),
    __metadata("design:type", Array)
], UserPermission.prototype, "groups", void 0);
exports.UserPermission = UserPermission = __decorate([
    (0, typeorm_1.Entity)('user_permissions')
], UserPermission);
//# sourceMappingURL=user-permission.entity.js.map