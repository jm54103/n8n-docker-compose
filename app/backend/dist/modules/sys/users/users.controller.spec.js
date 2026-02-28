"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
describe('UsersController', () => {
    let controller;
    let service;
    const createMockUsersService = () => ({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    });
    beforeEach(async () => {
        const mockService = createMockUsersService();
        const module = await testing_1.Test.createTestingModule({
            controllers: [users_controller_1.UsersController],
            providers: [
                {
                    provide: users_service_1.UsersService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(users_controller_1.UsersController);
        service = module.get(users_service_1.UsersService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a new user', async () => {
            const dto = {
                name: 'John Doe',
                email: 'john@example.com',
            };
            service.create.mockResolvedValue({
                id: 'uuid-123',
                ...dto,
            });
            const result = await controller.create(dto);
            expect(result).toEqual({
                id: 'uuid-123',
                ...dto,
            });
            expect(service.create).toHaveBeenCalledWith(dto);
            expect(service.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('findAll', () => {
        it('should return an array of users', async () => {
            service.findAll.mockResolvedValue([
                { id: 'uuid-123', name: 'John Doe' },
            ]);
            const result = await controller.findAll();
            expect(result).toEqual([
                { id: 'uuid-123', name: 'John Doe' },
            ]);
            expect(Array.isArray(result)).toBe(true);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });
    describe('findOne', () => {
        it('should return a single user by ID', async () => {
            const id = 'uuid-123';
            service.findOne.mockResolvedValue({
                id,
                username: 'John Doe',
            });
            const result = await controller.findOne(id);
            expect(result).toEqual({ id, username: 'John Doe' });
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });
    describe('update', () => {
        it('should update a user', async () => {
            const id = 'uuid-123';
            const dto = { username: 'Jane Doe' };
            service.update.mockResolvedValue({ id, ...dto });
            const result = await controller.update(id, dto);
            expect(result).toEqual({ id, ...dto });
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });
    describe('remove', () => {
        it('should remove a user', async () => {
            const id = 'uuid-123';
            service.remove.mockResolvedValue({
                deleted: true,
                id,
            });
            const result = await controller.remove(id);
            expect(result).toEqual({ deleted: true, id });
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
//# sourceMappingURL=users.controller.spec.js.map