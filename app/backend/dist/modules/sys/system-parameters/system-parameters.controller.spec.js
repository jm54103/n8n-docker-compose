"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const system_parameters_controller_1 = require("./system-parameters.controller");
const system_parameters_service_1 = require("./system-parameters.service");
describe('SystemParametersController', () => {
    let controller;
    let service;
    const createMockService = () => ({
        create: jest.fn(),
        findAll: jest.fn(),
        getValue: jest.fn(),
        update: jest.fn(),
    });
    beforeEach(async () => {
        const mockService = createMockService();
        const module = await testing_1.Test.createTestingModule({
            controllers: [system_parameters_controller_1.SystemParametersController],
            providers: [
                {
                    provide: system_parameters_service_1.SystemParametersService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(system_parameters_controller_1.SystemParametersController);
        service = module.get(system_parameters_service_1.SystemParametersService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a system parameter', async () => {
            const dto = {
                key: 'site_name',
                value: 'My App',
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
        it('should return all system parameters', async () => {
            const params = [
                { id: 1, key: 'site_name', value: 'My App' },
                { id: 2, key: 'timezone', value: 'UTC' },
            ];
            service.findAll.mockResolvedValue(params);
            const result = await controller.findAll();
            expect(result).toEqual(params);
            expect(Array.isArray(result)).toBe(true);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });
    describe('getValue', () => {
        it('should return value by key', async () => {
            const key = 'site_name';
            service.getValue.mockResolvedValue('My App');
            const result = await controller.getValue(key);
            expect(result).toEqual({
                key,
                value: 'My App',
            });
            expect(service.getValue).toHaveBeenCalledWith(key);
            expect(service.getValue).toHaveBeenCalledTimes(1);
        });
        it('should throw if service throws', async () => {
            service.getValue.mockRejectedValue(new Error('Not found'));
            await expect(controller.getValue('unknown'))
                .rejects
                .toThrow('Not found');
        });
    });
    describe('update', () => {
        it('should update a system parameter', async () => {
            const id = 1;
            const dto = {
                value: 'Updated Value',
            };
            service.update.mockResolvedValue({
                id,
                key: 'site_name',
                ...dto,
            });
            const result = await controller.update(id, dto);
            expect(result).toEqual({
                id,
                key: 'site_name',
                ...dto,
            });
            expect(service.update).toHaveBeenCalledWith(id, dto);
            expect(service.update).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=system-parameters.controller.spec.js.map