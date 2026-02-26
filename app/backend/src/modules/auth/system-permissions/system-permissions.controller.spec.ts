import { Test, TestingModule } from '@nestjs/testing';
import { SystemPermissionsController } from './system-permissions.controller';
import { SystemPermissionsService } from './system-permissions.service';
import {
  CreateSystemPermissionDto,
  UpdateSystemPermissionDto,
} from './dto';

describe('SystemPermissionsController', () => {
  let controller: SystemPermissionsController;
  let service: jest.Mocked<SystemPermissionsService>;

  const createMockService = (): jest.Mocked<SystemPermissionsService> =>
    ({
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const mockService = createMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemPermissionsController],
      providers: [
        {
          provide: SystemPermissionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SystemPermissionsController>(
      SystemPermissionsController,
    );
    service = module.get(SystemPermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // POST /system-permissions
  // -------------------------
  describe('create', () => {
    it('should create a permission', async () => {
      const dto: CreateSystemPermissionDto = {
        name: 'READ_USER',
        description: 'Permission to read user',
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
  // GET /system-permissions
  // -------------------------
  describe('findAll', () => {
    it('should return all permissions', async () => {
      const permissions = [
        { id: 1, name: 'READ_USER' },
        { id: 2, name: 'WRITE_USER' },
      ];

      service.findAll.mockResolvedValue(permissions as any);

      const result = await controller.findAll();

      expect(result).toEqual(permissions);
      expect(Array.isArray(result)).toBe(true);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------
  // GET /system-permissions/:id
  // -------------------------
  describe('findOne', () => {
    it('should return permission by id', async () => {
      const id = 1;

      service.findOne.mockResolvedValue({
        id,
        name: 'READ_USER',
      } as any);

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

  // -------------------------
  // PATCH /system-permissions/:id
  // -------------------------
  describe('update', () => {
    it('should update a permission', async () => {
      const id = 1;

      const dto: UpdateSystemPermissionDto = {
        description: 'Updated description',
      } as any;

      service.update.mockResolvedValue({
        id,
        name: 'READ_USER',
        ...dto,
      } as any);

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

  // -------------------------
  // DELETE /system-permissions/:id
  // -------------------------
  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = 1;

      service.remove.mockResolvedValue({
        deleted: true,
        id,
      } as any);

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