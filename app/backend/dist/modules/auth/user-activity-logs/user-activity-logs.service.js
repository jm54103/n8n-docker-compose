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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_activity_log_entity_1 = require("./entities/user-activity-log.entity");
let UserActivityLogsService = class UserActivityLogsService {
    constructor(activityRepo) {
        this.activityRepo = activityRepo;
    }
    async log(dto) {
        const newLog = this.activityRepo.create(dto);
        return await this.activityRepo.save(newLog);
    }
    async findAll() {
        return await this.activityRepo.find({
            relations: ['actor'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByTarget(table, id) {
        return await this.activityRepo.find({
            where: { targetTable: table, targetId: id },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.UserActivityLogsService = UserActivityLogsService;
exports.UserActivityLogsService = UserActivityLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_activity_log_entity_1.UserActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserActivityLogsService);
//# sourceMappingURL=user-activity-logs.service.js.map