"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemParametersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const system_parameters_service_1 = require("./system-parameters.service");
const system_parameters_controller_1 = require("./system-parameters.controller");
const system_parameter_entity_1 = require("./entities/system-parameter.entity");
let SystemParametersModule = class SystemParametersModule {
};
exports.SystemParametersModule = SystemParametersModule;
exports.SystemParametersModule = SystemParametersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([system_parameter_entity_1.SystemParameter]),
        ],
        controllers: [system_parameters_controller_1.SystemParametersController],
        providers: [system_parameters_service_1.SystemParametersService],
        exports: [system_parameters_service_1.SystemParametersService],
    })
], SystemParametersModule);
//# sourceMappingURL=system-parameters.module.js.map