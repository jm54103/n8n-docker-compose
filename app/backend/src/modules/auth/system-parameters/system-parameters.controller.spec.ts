import { Test, TestingModule } from '@nestjs/testing';
import { SystemParametersController } from './system-parameters.controller';
import { SystemParametersService } from './system-parameters.service';
import {
  CreateSystemParameterDto,
  UpdateSystemParameterDto,
} from './dto';

describe('SystemParametersController', () => {
  let controller: SystemParametersController;
  let service: jest.Mocked<SystemParametersService>;

  const createMockService = (): jest.Mocked<SystemParametersService> =>
    ({
      create: jest.fn(),
      findAll: jest.fn(),
      getValue: jest.fn(),
      update: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const mockService = createMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemParametersController],
      providers: [
        {
          provide: SystemParametersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SystemParametersController>(
      SystemParametersController,
    );
    service = module.get(SystemParametersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // POST /system-parameters
  // -------------------------
  describe('create', () => {
    it('should create a system parameter', async () => {
      const dto: CreateSystemParameterDto = {
        key: 'site_name',
        value: 'My App',
      } as any;

      service.create.mockResolvedValue({
        id: 1,
        ...dto,
      } as any);

      const result = await controller.create(dto);

      expect(result).toEqual({
        id: 1,
        ...dto,
      });

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------
  // GET /system-parameters
  // -------------------------
  describe('findAll', () => {
    it('should return all system parameters', async () => {
      const params = [
        { id: 1, key: 'site_name', value: 'My App' },
        { id: 2, key: 'timezone', value: 'UTC' },
      ];

      service.findAll.mockResolvedValue(params as any);

      const result = await controller.findAll();

      expect(result).toEqual(params);
      expect(Array.isArray(result)).toBe(true);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------
  // GET /system-parameters/:key/value
  // -------------------------
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

  // -------------------------
  // PATCH /system-parameters/:id
  // -------------------------
  describe('update', () => {
    it('should update a system parameter', async () => {
      const id = 1;
      const dto: UpdateSystemParameterDto = {
        value: 'Updated Value',
      } as any;

      service.update.mockResolvedValue({
        id,
        key: 'site_name',
        ...dto,
      } as any);

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