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
exports.SystemParametersController = void 0;
const common_1 = require("@nestjs/common");
const system_parameters_service_1 = require("./system-parameters.service");
const dto_1 = require("./dto");
let SystemParametersController = class SystemParametersController {
    constructor(paramService) {
        this.paramService = paramService;
    }
    create(createDto) {
        return this.paramService.create(createDto);
    }
    findAll() {
        return this.paramService.findAll();
    }
    async getValue(key) {
        const value = await this.paramService.getValue(key);
        return { key, value };
    }
    update(id, updateDto) {
        return this.paramService.update(id, updateDto);
    }
};
exports.SystemParametersController = SystemParametersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSystemParameterDto]),
    __metadata("design:returntype", void 0)
], SystemParametersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemParametersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':key/value'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemParametersController.prototype, "getValue", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateSystemParameterDto]),
    __metadata("design:returntype", void 0)
], SystemParametersController.prototype, "update", null);
exports.SystemParametersController = SystemParametersController = __decorate([
    (0, common_1.Controller)('system-parameters'),
    __metadata("design:paramtypes", [system_parameters_service_1.SystemParametersService])
], SystemParametersController);
//# sourceMappingURL=system-parameters.controller.js.map