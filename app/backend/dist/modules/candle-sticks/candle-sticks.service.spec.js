"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const candle_sticks_service_1 = require("./candle-sticks.service");
describe('CandleSticksService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [candle_sticks_service_1.CandleSticksService],
        }).compile();
        service = module.get(candle_sticks_service_1.CandleSticksService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=candle-sticks.service.spec.js.map