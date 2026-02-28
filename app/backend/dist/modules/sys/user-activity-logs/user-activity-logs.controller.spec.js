"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_activity_logs_controller_1 = require("./user-activity-logs.controller");
const user_activity_logs_service_1 = require("./user-activity-logs.service");
describe('UserActivityLogsController', () => {
    let controller;
    let service;
    const createMockService = () => ({
        findAll: jest.fn(),
        findByTarget: jest.fn(),
    });
    beforeEach(async () => {
        const mockService = createMockService();
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_activity_logs_controller_1.UserActivityLogsController],
            providers: [
                {
                    provide: user_activity_logs_service_1.UserActivityLogsService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(user_activity_logs_controller_1.UserActivityLogsController);
        service = module.get(user_activity_logs_service_1.UserActivityLogsService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('findAll', () => {
        it('should return all activity logs', async () => {
            const logs = [
                { id: 1, action: 'CREATE_USER' },
                { id: 2, action: 'UPDATE_USER' },
            ];
            service.findAll.mockResolvedValue(logs);
            const result = await controller.findAll();
            expect(result).toEqual(logs);
            expect(Array.isArray(result)).toBe(true);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
        it('should throw if service throws', async () => {
            service.findAll.mockRejectedValue(new Error('Database error'));
            await expect(controller.findAll())
                .rejects
                .toThrow('Database error');
        });
    });
    describe('findDetails', () => {
        it('should return logs by target table and id', async () => {
            const table = 'users';
            const id = '123';
            const logs = [
                { id: 1, table, targetId: id, action: 'UPDATE' },
            ];
            service.findByTarget.mockResolvedValue(logs);
            const result = await controller.findDetails(table, id);
            expect(result).toEqual(logs);
            expect(service.findByTarget).toHaveBeenCalledWith(table, id);
            expect(service.findByTarget).toHaveBeenCalledTimes(1);
        });
        it('should throw if service throws', async () => {
            service.findByTarget.mockRejectedValue(new Error('Not found'));
            await expect(controller.findDetails('users', '999'))
                .rejects
                .toThrow('Not found');
        });
    });
});
//# sourceMappingURL=user-activity-logs.controller.spec.js.map