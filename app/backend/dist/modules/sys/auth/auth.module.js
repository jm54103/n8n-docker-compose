"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const ioredis_1 = require("@nestjs-modules/ioredis");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./infrastructure/jwt/jwt.strategy");
const user_entity_1 = require("../users/entities/user.entity");
const user_session_entity_1 = require("./entities/user-session.entity");
const system_parameter_entity_1 = require("./../system-parameters/entities/system-parameter.entity");
const config_service_1 = require("@nestjs/config/dist/config.service");
const auth_logger_1 = require("./auth.logger");
require("winston-daily-rotate-file");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, auth_logger_1.AuthLogger, jwt_strategy_1.JwtStrategy],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_session_entity_1.UserSession, system_parameter_entity_1.SystemParameter]),
            passport_1.PassportModule,
            ioredis_1.RedisModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_service_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
            }),
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map