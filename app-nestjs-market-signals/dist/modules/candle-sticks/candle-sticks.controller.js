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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleSticksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const candle_sticks_service_1 = require("./candle-sticks.service");
const candle_stick_entity_1 = require("../../entities/candle-stick.entity");
let CandleSticksController = class CandleSticksController {
    constructor(candleSticksService) {
        this.candleSticksService = candleSticksService;
    }
    async findAll(symbol) {
        return await this.candleSticksService.findAllBySymbol(symbol.toUpperCase());
    }
    async findByRange(symbol, start, end) {
        return await this.candleSticksService.findByDateRange(symbol.toUpperCase(), new Date(start), new Date(end));
    }
    async create(candleData) {
        return await this.candleSticksService.create(candleData);
    }
};
exports.CandleSticksController = CandleSticksController;
__decorate([
    (0, common_1.Get)(':symbol'),
    (0, swagger_1.ApiOperation)({ summary: 'ดึงข้อมูลแท่งเทียนทั้งหมดตาม Symbol' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'คืนค่ารายการแท่งเทียน', type: [candle_stick_entity_1.CandleStick] }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandleSticksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':symbol/range'),
    (0, swagger_1.ApiOperation)({ summary: 'ดึงข้อมูลแท่งเทียนตามช่วงวันที่' }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2026-01-01' }),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CandleSticksController.prototype, "findByRange", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'บันทึกข้อมูลแท่งเทียนใหม่' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'บันทึกสำเร็จ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CandleSticksController.prototype, "create", null);
exports.CandleSticksController = CandleSticksController = __decorate([
    (0, swagger_1.ApiTags)('CandleSticks'),
    (0, common_1.Controller)('candle-sticks'),
    __metadata("design:paramtypes", [candle_sticks_service_1.CandleSticksService])
], CandleSticksController);
//# sourceMappingURL=candle-sticks.controller.js.map