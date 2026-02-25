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
exports.UserGroup = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/auth/users/entities/user.entity");
let UserGroup = class UserGroup {
};
exports.UserGroup = UserGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserGroup.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_name', unique: true, length: 50 }),
    __metadata("design:type", String)
], UserGroup.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserGroup.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserGroup.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.group),
    __metadata("design:type", Array)
], UserGroup.prototype, "users", void 0);
exports.UserGroup = UserGroup = __decorate([
    (0, typeorm_1.Entity)('user_groups')
], UserGroup);
//# sourceMappingURL=user-group.entity.js.map