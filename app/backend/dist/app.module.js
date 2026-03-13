"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const ioredis_1 = require("@nestjs-modules/ioredis");
const market_signals_module_1 = require("./modules/app/stocks/market-signals/market-signals.module");
const market_signal_entity_1 = require("./modules/app/stocks/market-signals/entities/market-signal.entity");
const candle_sticks_module_1 = require("./modules/app/stocks/candle-sticks/candle-sticks.module");
const candle_stick_entity_1 = require("./modules/app/stocks/candle-sticks/entities/candle-stick.entity");
const system_parameters_module_1 = require("./modules/sys/system-parameters/system-parameters.module");
const system_parameter_entity_1 = require("./modules/sys/system-parameters/entities/system-parameter.entity");
const system_permissions_module_1 = require("./modules/sys/system-permissions/system-permissions.module");
const system_permission_entity_1 = require("./modules/sys/system-permissions/entities/system-permission.entity");
const users_module_1 = require("./modules/sys/users/users.module");
const user_entity_1 = require("./modules/sys/users/entities/user.entity");
const user_groups_module_1 = require("./modules/sys/user-groups/user-groups.module");
const user_group_entity_1 = require("./modules/sys/user-groups/entities/user-group.entity");
const auth_module_1 = require("./modules/sys/auth/auth.module");
const user_session_entity_1 = require("./modules/sys/auth/entities/user-session.entity");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/error-%DATE%.log',
                        level: 'error',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/warning-%DATE%.log',
                        level: 'warn',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/info-%DATE%.log',
                        level: 'info',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/debug-%DATE%.log',
                        level: 'debug',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/verbose-%DATE%.log',
                        level: 'verbose',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/application-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '50m',
                        maxFiles: '30d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        })),
                    }),
                ],
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env.development',
                isGlobal: true,
            }),
            ioredis_1.RedisModule.forRoot({
                type: 'single',
                options: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: Number(process.env.REDIS_PORT) || 6379,
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                entities: [
                    market_signal_entity_1.MarketSignal,
                    candle_stick_entity_1.CandleStick,
                    system_parameter_entity_1.SystemParameter,
                    system_permission_entity_1.SystemPermission,
                    user_entity_1.User,
                    user_group_entity_1.UserGroup,
                    user_session_entity_1.UserSession,
                ],
                synchronize: false,
            }),
            market_signals_module_1.MarketSignalsModule,
            candle_sticks_module_1.CandleSticksModule,
            system_parameters_module_1.SystemParametersModule,
            system_permissions_module_1.SystemPermissionsModule,
            users_module_1.UsersModule,
            user_groups_module_1.UserGroupsModule,
            ioredis_1.RedisModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map