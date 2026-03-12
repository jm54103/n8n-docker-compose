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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passport_jwt_1 = require("passport-jwt");
const user_session_entity_1 = require("../../entities/user-session.entity");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const ioredis_2 = require("@nestjs-modules/ioredis");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(redis, sessionRepo, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.redis = redis;
        this.sessionRepo = sessionRepo;
        this.configService = configService;
    }
    async validate(payload) {
        return this.validateRedis(payload);
    }
    async validateByRepo(payload) {
        console.log('call validate()');
        console.log('1. JWT Payload:', payload);
        const session = await this.sessionRepo.findOne({
            where: { sessionId: payload.sessionId, isActive: true },
        });
        console.log('2. Session from DB:', session);
        if (!session) {
            console.log('3. Validate Failed: Session not found or inactive');
            throw new common_1.UnauthorizedException('Session is no longer active');
        }
        return payload;
    }
    async validateRedis(payload) {
        const { sessionId } = payload;
        const cachedSession = await this.redis.get(`session:${sessionId}`);
        if (cachedSession) {
            console.log('--- Cache Hit: Session found in Redis ---');
            if (cachedSession === 'inactive') {
                throw new common_1.UnauthorizedException('Session is no longer active');
            }
            return payload;
        }
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_2.InjectRedis)()),
    __param(1, (0, typeorm_1.InjectRepository)(user_session_entity_1.UserSession)),
    __metadata("design:paramtypes", [ioredis_1.default,
        typeorm_2.Repository,
        config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map