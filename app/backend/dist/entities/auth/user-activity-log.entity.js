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
exports.UserActivityLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/auth/users/entities/user.entity");
let UserActivityLog = class UserActivityLog {
};
exports.UserActivityLog = UserActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'activity_id' }),
    __metadata("design:type", String)
], UserActivityLog.prototype, "activityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actor_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UserActivityLog.prototype, "actorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'actor_id' }),
    __metadata("design:type", user_entity_1.User)
], UserActivityLog.prototype, "actor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'action_type', length: 50 }),
    __metadata("design:type", String)
], UserActivityLog.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_table', length: 50, nullable: true }),
    __metadata("design:type", String)
], UserActivityLog.prototype, "targetTable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UserActivityLog.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'old_value', nullable: true }),
    __metadata("design:type", Object)
], UserActivityLog.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'new_value', nullable: true }),
    __metadata("design:type", Object)
], UserActivityLog.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserActivityLog.prototype, "createdAt", void 0);
exports.UserActivityLog = UserActivityLog = __decorate([
    (0, typeorm_1.Entity)('user_activity_logs')
], UserActivityLog);
//# sourceMappingURL=user-activity-log.entity.js.map