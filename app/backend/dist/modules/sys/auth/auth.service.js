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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const system_parameter_entity_1 = require("../system-parameters/entities/system-parameter.entity");
const user_session_entity_1 = require("./entities/user-session.entity");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const ioredis_2 = require("@nestjs-modules/ioredis");
const uuid_1 = require("uuid");
const winston_constants_1 = require("nest-winston/dist/winston.constants");
const auth_logger_1 = require("./auth.logger");
let AuthService = class AuthService {
    constructor(logger, userRepo, sessionRepo, paramRepo, redis, configService, jwtService, auth_logger) {
        this.logger = logger;
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.paramRepo = paramRepo;
        this.redis = redis;
        this.configService = configService;
        this.jwtService = jwtService;
        this.auth_logger = auth_logger;
    }
    async getParam(key) {
        const param = await this.paramRepo.findOne({ where: { paramKey: key } });
        return param.getTypedValue();
    }
    async getConfig(key) {
        return this.configService.get(key);
    }
    async loginRepo(user, deviceInfo) {
        const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
        const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
        const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');
        const session = this.sessionRepo.create({
            userId: user.username,
            expiresAt: new Date(Date.now() + sessionTimeout * 1000),
            deviceInfo,
        });
        await this.sessionRepo.save(session);
        const payload = {
            sub: user.username,
            sessionId: session.sessionId,
        };
        const mins = parseInt(accessTokenExpiresIn, 10);
        const days = parseInt(refreshTokenExpiresIn, 10);
        const accessTokenJwtSignOptions = { expiresIn: `${mins}min` };
        const refreshTokenJwtSignOptions = { expiresIn: `${days}d` };
        const accessToken = this.jwtService.sign(payload, accessTokenJwtSignOptions);
        const refreshToken = this.jwtService.sign(payload, refreshTokenJwtSignOptions);
        session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.sessionRepo.save(session);
        return {
            accessToken,
            refreshToken,
        };
    }
    async loginRedisWithLogging(user, deviceInfo) {
        try {
            const sessionId = (0, uuid_1.v4)();
            const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
            const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
            const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');
            const payload = { sub: user.username, sessionId };
            const mins = parseInt(accessTokenExpiresIn, 10);
            const days = parseInt(refreshTokenExpiresIn, 10);
            const accessToken = this.jwtService.sign(payload, { expiresIn: `${mins}min` });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: `${days}d` });
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
            const sessionData = {
                userId: user.username,
                deviceInfo,
                refreshTokenHash,
                isActive: true,
            };
            await this.redis.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', sessionTimeout);
            this.auth_logger.log(`User ${user.username} logged in from device: ${deviceInfo}`, 'AuthService');
            return { accessToken, refreshToken };
        }
        catch (error) {
            this.logger.error(`Login error for user ${user.username}`, error.stack, 'AuthService');
            throw new common_1.InternalServerErrorException('Login failed due to server error');
        }
    }
    async refreshRepo(refreshToken) {
        const payload = this.jwtService.verify(refreshToken);
        const session = await this.sessionRepo.findOne({
            where: { sessionId: payload.sessionId, isActive: true },
        });
        if (!session)
            throw new common_1.UnauthorizedException();
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (!isValid)
            throw new common_1.UnauthorizedException();
        const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
        const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
        const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');
        const mins = parseInt(accessTokenExpiresIn, 10);
        const days = parseInt(refreshTokenExpiresIn, 10);
        const accessTokenJwtSignOptions = { expiresIn: `${mins}min` };
        const newAccess = this.jwtService.sign(payload, accessTokenJwtSignOptions);
        const refreshTokenJwtSignOptions = { expiresIn: `${days}d` };
        const newRefresh = this.jwtService.sign(payload, refreshTokenJwtSignOptions);
        session.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
        await this.sessionRepo.save(session);
        return { accessToken: newAccess, refreshToken: newRefresh };
    }
    async refreshRedisWithLogging(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const sessionKey = `session:${payload.sessionId}`;
            const cachedSession = await this.redis.get(sessionKey);
            if (!cachedSession)
                throw new common_1.UnauthorizedException('Session expired');
            const sessionData = JSON.parse(cachedSession);
            const isValid = await bcrypt.compare(refreshToken, sessionData.refreshTokenHash);
            if (!isValid)
                throw new common_1.UnauthorizedException('Invalid refresh token');
            const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
            const accessTokenExpiresIn = await this.getConfig('JWT_EXPIRES_IN');
            const refreshTokenExpiresIn = await this.getConfig('JWT_REFRESH_EXPIRES_IN');
            const mins = parseInt(accessTokenExpiresIn, 10);
            const days = parseInt(refreshTokenExpiresIn, 10);
            const accessTokenJwtSignOptions = { expiresIn: `${mins}min` };
            const newAccess = this.jwtService.sign(payload, accessTokenJwtSignOptions);
            const refreshTokenJwtSignOptions = { expiresIn: `${days}d` };
            const newRefresh = this.jwtService.sign(payload, refreshTokenJwtSignOptions);
            sessionData.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
            await this.redis.set(sessionKey, JSON.stringify(sessionData), 'EX', sessionTimeout);
            this.logger.warn(`Token rotated for user ${payload.sub}`, 'AuthService');
            return { accessToken: newAccess, refreshToken: newRefresh };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            this.logger.error('Refresh token process failed', error.stack, 'AuthService');
            throw new common_1.UnauthorizedException('Token verification failed');
        }
    }
    async logoutRepo(sessionId) {
        let session = await this.sessionRepo.update({ sessionId }, { isActive: false });
        return (session == null) ? { success: false } : { success: true };
    }
    async logoutRedisWithLogging(userId, sessionId) {
        try {
            const result = await this.redis.del(`session:${sessionId}`);
            this.auth_logger.log(`User ${userId} session ${sessionId} logout`, 'AuthService');
            return result > 0 ? { success: true } : { success: false };
        }
        catch (error) {
            this.logger.error(`Logout failed for user ${userId} session ${sessionId}`, error.stack, 'AuthService');
            throw new common_1.InternalServerErrorException('Logout all failed');
        }
    }
    async logoutAll(userId) {
        let session = await this.sessionRepo.update({ userId }, { isActive: false });
        return (session == null) ? { success: false } : { success: true };
    }
    async logoutAllRedisWithLogging(userId) {
        try {
            const keys = await this.redis.keys('session:*');
            let deletedCount = 0;
            for (const key of keys) {
                const data = await this.redis.get(key);
                if (data) {
                    const session = JSON.parse(data);
                    if (session.userId === userId) {
                        await this.redis.del(key);
                        deletedCount++;
                    }
                }
            }
            this.auth_logger.log(`User ${userId} forced logout from ${deletedCount} sessions`, 'AuthService');
            return deletedCount > 0 ? { success: true } : { success: false };
        }
        catch (error) {
            this.logger.error(`LogoutAll failed for user ${userId}`, error.stack, 'AuthService');
            throw new common_1.InternalServerErrorException('Logout all failed');
        }
    }
    async validateUser(dto) {
        const user = await this.userRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.username = :username', { username: dto.username })
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException();
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch)
            throw new common_1.UnauthorizedException();
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(winston_constants_1.WINSTON_MODULE_NEST_PROVIDER)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(user_session_entity_1.UserSession)),
    __param(3, (0, typeorm_1.InjectRepository)(system_parameter_entity_1.SystemParameter)),
    __param(4, (0, ioredis_2.InjectRedis)()),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ioredis_1.default,
        config_1.ConfigService,
        jwt_1.JwtService,
        auth_logger_1.AuthLogger])
], AuthService);
//# sourceMappingURL=auth.service.js.map