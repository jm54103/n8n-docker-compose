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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
let AuthService = class AuthService {
    constructor(userRepo, sessionRepo, paramRepo, jwtService) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.paramRepo = paramRepo;
        this.jwtService = jwtService;
    }
    async getParam(key) {
        const param = await this.paramRepo.findOne({ where: { paramKey: key } });
        return param.getTypedValue();
    }
    async login(user, deviceInfo) {
        const sessionTimeout = await this.getParam('SESSION_TIMEOUT_SEC');
        const session = this.sessionRepo.create({
            userId: user.userId,
            expiresAt: new Date(Date.now() + sessionTimeout * 1000),
            deviceInfo,
        });
        await this.sessionRepo.save(session);
        const payload = {
            sub: user.userId,
            sessionId: session.sessionId,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.sessionRepo.save(session);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken) {
        const payload = this.jwtService.verify(refreshToken);
        const session = await this.sessionRepo.findOne({
            where: { sessionId: payload.sessionId, isActive: true },
        });
        if (!session)
            throw new common_1.UnauthorizedException();
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (!isValid)
            throw new common_1.UnauthorizedException();
        const newRefresh = this.jwtService.sign({ sub: payload.sub, sessionId: payload.sessionId }, { expiresIn: '7d' });
        session.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
        await this.sessionRepo.save(session);
        const newAccess = this.jwtService.sign({ sub: payload.sub, sessionId: payload.sessionId }, { expiresIn: '15m' });
        return {
            accessToken: newAccess,
            refreshToken: newRefresh,
        };
    }
    async logout(sessionId) {
        await this.sessionRepo.update({ sessionId }, { isActive: false });
    }
    async logoutAll(userId) {
        await this.sessionRepo.update({ userId }, { isActive: false });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map