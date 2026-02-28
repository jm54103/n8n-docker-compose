"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_groups_controller_1 = require("./user-groups.controller");
const user_groups_service_1 = require("./user-groups.service");
describe('UserGroupsController', () => {
    let controller;
    let service;
    const createMockService = () => ({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    });
    beforeEach(async () => {
        const mockService = createMockService();
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_groups_controller_1.UserGroupsController],
            providers: [
                {
                    provide: user_groups_service_1.UserGroupsService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(user_groups_controller_1.UserGroupsController);
        service = module.get(user_groups_service_1.UserGroupsService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a new user group', async () => {
            const dto = {
                name: 'Admin Group',
            };
            service.create.mockResolvedValue({
                id: 1,
                ...dto,
            });
            const result = await controller.create(dto);
            expect(result).toEqual({
                id: 1,
                ...dto,
            });
            expect(service.create).toHaveBeenCalledWith(dto);
            expect(service.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('findAll', () => {
        it('should return all groups', async () => {
            const groups = [
                { id: 1, name: 'Admin Group' },
                { id: 2, name: 'User Group' },
            ];
            service.findAll.mockResolvedValue(groups);
            const result = await controller.findAll();
            expect(result).toEqual(groups);
            expect(Array.isArray(result)).toBe(true);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });
    describe('findOne', () => {
        it('should return a group by id', async () => {
            const id = 1;
            service.findOne.mockResolvedValue({
                id,
                name: 'Admin Group',
            });
            const result = await controller.findOne(id);
            expect(result).toEqual({
                id,
                name: 'Admin Group',
            });
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });
    describe('update', () => {
        it('should update a group', async () => {
            const id = 1;
            const dto = {
                name: 'Updated Group',
            };
            service.update.mockResolvedValue({
                id,
                ...dto,
            });
            const result = await controller.update(id, dto);
            expect(result).toEqual({
                id,
                ...dto,
            });
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });
    describe('remove', () => {
        it('should remove a group', async () => {
            const id = 1;
            service.remove.mockResolvedValue({
                deleted: true,
                id,
            });
            const result = await controller.remove(id);
            expect(result).toEqual({
                deleted: true,
                id,
            });
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
//# sourceMappingURL=user-groups.controller.spec.js.map