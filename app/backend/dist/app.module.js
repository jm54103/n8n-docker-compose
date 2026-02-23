"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const market_signals_module_1 = require("./modules/market-signals/market-signals.module");
const market_signal_entity_1 = require("./entities/market-signal.entity");
const candle_sticks_module_1 = require("./modules/candle-sticks/candle-sticks.module");
const candle_stick_entity_1 = require("./entities/candle-stick.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env.development',
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                entities: [market_signal_entity_1.MarketSignal, candle_stick_entity_1.CandleStick],
                synchronize: false,
            }),
            market_signals_module_1.MarketSignalsModule, candle_sticks_module_1.CandleSticksModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map