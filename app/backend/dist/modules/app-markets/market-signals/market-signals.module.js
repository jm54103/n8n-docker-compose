"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSignalsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const market_signal_entity_1 = require("./entities/market-signal.entity");
const market_signals_controller_1 = require("./market-signals.controller");
const market_signals_service_1 = require("./market-signals.service");
let MarketSignalsModule = class MarketSignalsModule {
};
exports.MarketSignalsModule = MarketSignalsModule;
exports.MarketSignalsModule = MarketSignalsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([market_signal_entity_1.MarketSignal])],
        controllers: [market_signals_controller_1.MarketSignalsController],
        providers: [market_signals_service_1.MarketSignalsService],
        exports: [market_signals_service_1.MarketSignalsService],
    })
], MarketSignalsModule);
//# sourceMappingURL=market-signals.module.js.map