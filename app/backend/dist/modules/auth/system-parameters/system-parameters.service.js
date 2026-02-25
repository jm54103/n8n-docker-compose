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
exports.SystemParametersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_parameter_entity_1 = require("./entities/system-parameter.entity");
let SystemParametersService = class SystemParametersService {
    constructor(paramRepo) {
        this.paramRepo = paramRepo;
    }
    async create(dto) {
        const existing = await this.paramRepo.findOne({ where: { paramKey: dto.paramKey } });
        if (existing)
            throw new common_1.ConflictException('Parameter key already exists');
        const param = this.paramRepo.create(dto);
        return await this.paramRepo.save(param);
    }
    async findAll() {
        return await this.paramRepo.find();
    }
    async getValue(key) {
        const param = await this.paramRepo.findOne({ where: { paramKey: key } });
        if (!param)
            throw new common_1.NotFoundException(`Parameter ${key} not found`);
        return param.getTypedValue();
    }
    async update(id, dto) {
        const param = await this.paramRepo.findOne({ where: { paramId: id } });
        if (!param)
            throw new common_1.NotFoundException('Parameter not found');
        Object.assign(param, dto);
        return await this.paramRepo.save(param);
    }
};
exports.SystemParametersService = SystemParametersService;
exports.SystemParametersService = SystemParametersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_parameter_entity_1.SystemParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemParametersService);
//# sourceMappingURL=system-parameters.service.js.map