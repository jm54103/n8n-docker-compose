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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSignal = exports.ColumnNumericTransformer = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
class ColumnNumericTransformer {
    to(data) {
        return data;
    }
    from(data) {
        return data ? parseFloat(data) : null;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ColumnNumericTransformer = ColumnNumericTransformer;
let MarketSignal = class MarketSignal {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, symbol: { required: true, type: () => String }, last_close: { required: true, type: () => Number }, signal: { required: true, type: () => String }, trend: { required: true, type: () => String }, rsi_14: { required: true, type: () => Number }, rsi_overbought: { required: true, type: () => Number }, rsi_oversold: { required: true, type: () => Number }, ema_50: { required: true, type: () => Number }, ema_200: { required: true, type: () => Number }, golden_cross: { required: true, type: () => Boolean }, death_cross: { required: true, type: () => Boolean }, updated_at: { required: true, type: () => Date } };
    }
};
exports.MarketSignal = MarketSignal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MarketSignal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], MarketSignal.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 20, scale: 8, nullable: true, transformer: new ColumnNumericTransformer() }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "last_close", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250, nullable: true }),
    __metadata("design:type", String)
], MarketSignal.prototype, "signal", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250, nullable: true }),
    __metadata("design:type", String)
], MarketSignal.prototype, "trend", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "rsi_14", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2, default: 70 }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "rsi_overbought", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "rsi_oversold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "ema_50", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], MarketSignal.prototype, "ema_200", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MarketSignal.prototype, "golden_cross", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MarketSignal.prototype, "death_cross", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MarketSignal.prototype, "updated_at", void 0);
exports.MarketSignal = MarketSignal = __decorate([
    (0, typeorm_1.Entity)('market_signals')
], MarketSignal);
//# sourceMappingURL=market-signal.entity.js.map