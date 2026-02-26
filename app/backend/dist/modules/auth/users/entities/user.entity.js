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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const user_group_entity_1 = require("../../user-groups/entities/user-group.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'user_id' }),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 100 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', select: false }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_group_entity_1.UserGroup, (group) => group.users, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", user_group_entity_1.UserGroup)
], User.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE', length: 20 }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_logged_in', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isLoggedIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_key', type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "sessionKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'login_attempts', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "loginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_until', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lockUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "updatedBy", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map