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
exports.CandleStick = void 0;
const typeorm_1 = require("typeorm");
let CandleStick = class CandleStick {
};
exports.CandleStick = CandleStick;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar' }),
    __metadata("design:type", String)
], CandleStick.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], CandleStick.prototype, "x", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], CandleStick.prototype, "o", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], CandleStick.prototype, "h", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], CandleStick.prototype, "l", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], CandleStick.prototype, "c", void 0);
exports.CandleStick = CandleStick = __decorate([
    (0, typeorm_1.Entity)({ name: 'candle_sticks', schema: 'public' })
], CandleStick);
//# sourceMappingURL=candle-stick.entity.js.map