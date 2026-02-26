"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_access_logs_controller_1 = require("./user-access-logs.controller");
const user_access_logs_service_1 = require("./user-access-logs.service");
describe('UserAccessLogsController', () => {
    let controller;
    let service;
    const createMockService = () => ({
        findAll: jest.fn(),
        findByUserId: jest.fn(),
    });
    beforeEach(async () => {
        const mockService = createMockService();
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_access_logs_controller_1.UserAccessLogsController],
            providers: [
                {
                    provide: user_access_logs_service_1.UserAccessLogsService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(user_access_logs_controller_1.UserAccessLogsController);
        service = module.get(user_access_logs_service_1.UserAccessLogsService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('findAll', () => {
        it('should return logs with limit', async () => {
            const limit = 10;
            const logs = [
                { id: 1, action: 'LOGIN' },
                { id: 2, action: 'LOGOUT' },
            ];
            service.findAll.mockResolvedValue(logs);
            const result = await controller.findAll(limit);
            expect(result).toEqual(logs);
            expect(service.findAll).toHaveBeenCalledWith(limit);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
        it('should return logs without limit', async () => {
            const logs = [{ id: 1, action: 'LOGIN' }];
            service.findAll.mockResolvedValue(logs);
            const result = await controller.findAll();
            expect(result).toEqual(logs);
            expect(service.findAll).toHaveBeenCalledWith(undefined);
        });
    });
    describe('findByUser', () => {
        it('should return logs for a user', async () => {
            const userId = '550e8400-e29b-41d4-a716-446655440000';
            const logs = [
                { id: 1, action: 'LOGIN', userId },
            ];
            service.findByUserId.mockResolvedValue(logs);
            const result = await controller.findByUser(userId);
            expect(result).toEqual(logs);
            expect(service.findByUserId).toHaveBeenCalledWith(userId);
            expect(service.findByUserId).toHaveBeenCalledTimes(1);
        });
        it('should throw if service throws', async () => {
            const userId = '550e8400-e29b-41d4-a716-446655440000';
            service.findByUserId.mockRejectedValue(new Error('User not found'));
            await expect(controller.findByUser(userId))
                .rejects
                .toThrow('User not found');
        });
    });
});
//# sourceMappingURL=user-access-logs.controller.spec.js.map