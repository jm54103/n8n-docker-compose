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
exports.UserGroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_group_entity_1 = require("./entities/user-group.entity");
const system_permission_entity_1 = require("./../system-permissions/entities/system-permission.entity");
let UserGroupsService = class UserGroupsService {
    constructor(groupRepo, permissionRepo) {
        this.groupRepo = groupRepo;
        this.permissionRepo = permissionRepo;
    }
    async create(dto) {
        const group = this.groupRepo.create(dto);
        if (dto.permissionIds) {
            group.permissions = await this.permissionRepo.findBy({
                permissionId: (0, typeorm_2.In)(dto.permissionIds),
            });
        }
        return await this.groupRepo.save(group);
    }
    async findAll() {
        return await this.groupRepo.find({ relations: ['permissions'] });
    }
    async findOne(id) {
        const group = await this.groupRepo.findOne({
            where: { groupId: id },
            relations: ['permissions'],
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        return group;
    }
    async update(id, dto) {
        const group = await this.findOne(id);
        if (dto.permissionIds) {
            group.permissions = await this.permissionRepo.findBy({
                permissionId: (0, typeorm_2.In)(dto.permissionIds),
            });
        }
        Object.assign(group, dto);
        return await this.groupRepo.save(group);
    }
    async remove(id) {
        const group = await this.findOne(id);
        return await this.groupRepo.remove(group);
    }
};
exports.UserGroupsService = UserGroupsService;
exports.UserGroupsService = UserGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_group_entity_1.UserGroup)),
    __param(1, (0, typeorm_1.InjectRepository)(system_permission_entity_1.SystemPermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserGroupsService);
//# sourceMappingURL=user-groups.service.js.map