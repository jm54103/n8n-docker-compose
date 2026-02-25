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
exports.UserAccessLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/auth/users/entities/user.entity");
let UserAccessLog = class UserAccessLog {
};
exports.UserAccessLog = UserAccessLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'access_id' }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "accessId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserAccessLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'action_type', length: 50 }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserAccessLog.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserAccessLog.prototype, "createdAt", void 0);
exports.UserAccessLog = UserAccessLog = __decorate([
    (0, typeorm_1.Entity)('user_access_logs')
], UserAccessLog);
//# sourceMappingURL=user-access-log.entity.js.map