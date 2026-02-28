"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const system_permissions_controller_1 = require("./system-permissions.controller");
const system_permissions_service_1 = require("./system-permissions.service");
describe('SystemPermissionsController', () => {
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
            controllers: [system_permissions_controller_1.SystemPermissionsController],
            providers: [
                {
                    provide: system_permissions_service_1.SystemPermissionsService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(system_permissions_controller_1.SystemPermissionsController);
        service = module.get(system_permissions_service_1.SystemPermissionsService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a permission', async () => {
            const dto = {
                name: 'READ_USER',
                description: 'Permission to read user',
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
        it('should return all permissions', async () => {
            const permissions = [
                { id: 1, name: 'READ_USER' },
                { id: 2, name: 'WRITE_USER' },
            ];
            service.findAll.mockResolvedValue(permissions);
            const result = await controller.findAll();
            expect(result).toEqual(permissions);
            expect(Array.isArray(result)).toBe(true);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });
    describe('findOne', () => {
        it('should return permission by id', async () => {
            const id = 1;
            service.findOne.mockResolvedValue({
                id,
                name: 'READ_USER',
            });
            const result = await controller.findOne(id);
            expect(result).toEqual({
                id,
                name: 'READ_USER',
            });
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(service.findOne).toHaveBeenCalledTimes(1);
        });
        it('should throw if service throws', async () => {
            service.findOne.mockRejectedValue(new Error('Not found'));
            await expect(controller.findOne(999))
                .rejects
                .toThrow('Not found');
        });
    });
    describe('update', () => {
        it('should update a permission', async () => {
            const id = 1;
            const dto = {
                description: 'Updated description',
            };
            service.update.mockResolvedValue({
                id,
                name: 'READ_USER',
                ...dto,
            });
            const result = await controller.update(id, dto);
            expect(result).toEqual({
                id,
                name: 'READ_USER',
                ...dto,
            });
            expect(service.update).toHaveBeenCalledWith(id, dto);
            expect(service.update).toHaveBeenCalledTimes(1);
        });
    });
    describe('remove', () => {
        it('should remove a permission', async () => {
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
            expect(service.remove).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=system-permissions.controller.spec.js.map