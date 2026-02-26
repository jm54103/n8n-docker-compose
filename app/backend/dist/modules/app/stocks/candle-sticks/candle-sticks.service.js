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
exports.CandleSticksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candle_stick_entity_1 = require("./entities/candle-stick.entity");
let CandleSticksService = class CandleSticksService {
    constructor(candleRepository) {
        this.candleRepository = candleRepository;
    }
    async findAllBySymbol(symbol) {
        return await this.candleRepository.find({
            where: { symbol },
            order: { x: 'ASC' },
        });
    }
    async findByDateRange(symbol, startDate, endDate) {
        console.log('symbol:' + symbol);
        return await this.candleRepository.find({
            where: {
                symbol,
                x: (0, typeorm_2.Between)(startDate, endDate)
            },
            order: { x: 'ASC' },
        });
    }
    async create(data) {
        const newCandle = this.candleRepository.create(data);
        return await this.candleRepository.save(newCandle);
    }
    async remove(symbol, x) {
        await this.candleRepository.delete({ symbol, x });
    }
};
exports.CandleSticksService = CandleSticksService;
exports.CandleSticksService = CandleSticksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candle_stick_entity_1.CandleStick)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CandleSticksService);
//# sourceMappingURL=candle-sticks.service.js.map