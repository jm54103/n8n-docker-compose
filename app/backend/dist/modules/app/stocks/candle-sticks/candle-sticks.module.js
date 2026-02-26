"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleSticksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const candle_stick_entity_1 = require("./entities/candle-stick.entity");
const candle_sticks_controller_1 = require("./candle-sticks.controller");
const candle_sticks_service_1 = require("./candle-sticks.service");
let CandleSticksModule = class CandleSticksModule {
};
exports.CandleSticksModule = CandleSticksModule;
exports.CandleSticksModule = CandleSticksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([candle_stick_entity_1.CandleStick])],
        controllers: [candle_sticks_controller_1.CandleSticksController],
        providers: [candle_sticks_service_1.CandleSticksService],
        exports: [candle_sticks_service_1.CandleSticksService],
    })
], CandleSticksModule);
//# sourceMappingURL=candle-sticks.module.js.map