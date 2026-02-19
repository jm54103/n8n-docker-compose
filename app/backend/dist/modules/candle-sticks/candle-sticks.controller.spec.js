"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const candle_sticks_controller_1 = require("./candle-sticks.controller");
describe('CandleSticksController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [candle_sticks_controller_1.CandleSticksController],
        }).compile();
        controller = module.get(candle_sticks_controller_1.CandleSticksController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=candle-sticks.controller.spec.js.map