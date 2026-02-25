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
exports.SystemPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_permission_entity_1 = require("./entities/system-permission.entity");
let SystemPermissionsService = class SystemPermissionsService {
    constructor(permissionRepo) {
        this.permissionRepo = permissionRepo;
    }
    async create(dto) {
        const existing = await this.permissionRepo.findOne({ where: { permissionKey: dto.permissionKey } });
        if (existing)
            throw new common_1.ConflictException('Permission key already exists');
        const permission = this.permissionRepo.create(dto);
        return await this.permissionRepo.save(permission);
    }
    async findAll() {
        return await this.permissionRepo.find();
    }
    async findOne(id) {
        const permission = await this.permissionRepo.findOne({ where: { permissionId: id } });
        if (!permission)
            throw new common_1.NotFoundException('Permission not found');
        return permission;
    }
    async update(id, dto) {
        const permission = await this.findOne(id);
        Object.assign(permission, dto);
        return await this.permissionRepo.save(permission);
    }
    async remove(id) {
        const permission = await this.findOne(id);
        return await this.permissionRepo.remove(permission);
    }
};
exports.SystemPermissionsService = SystemPermissionsService;
exports.SystemPermissionsService = SystemPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_permission_entity_1.SystemPermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemPermissionsService);
//# sourceMappingURL=system-permissions.service.js.map