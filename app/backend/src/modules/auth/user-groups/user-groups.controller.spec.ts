import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';

describe('UserGroupsController', () => {
  let controller: UserGroupsController;
  let service: jest.Mocked<UserGroupsService>;

  const createMockService = (): jest.Mocked<UserGroupsService> =>
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
      controllers: [UserGroupsController],
      providers: [
        {
          provide: UserGroupsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserGroupsController>(UserGroupsController);
    service = module.get(UserGroupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // POST /user-groups
  // -------------------------
  describe('create', () => {
    it('should create a new user group', async () => {
      const dto: CreateUserGroupDto = {
        name: 'Admin Group',
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
  // GET /user-groups
  // -------------------------
  describe('findAll', () => {
    it('should return all groups', async () => {
      const groups = [
        { id: 1, name: 'Admin Group' },
        { id: 2, name: 'User Group' },
      ];

      service.findAll.mockResolvedValue(groups as any);

      const result = await controller.findAll();

      expect(result).toEqual(groups);
      expect(Array.isArray(result)).toBe(true);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------
  // GET /user-groups/:id
  // -------------------------
  describe('findOne', () => {
    it('should return a group by id', async () => {
      const id = 1;

      service.findOne.mockResolvedValue({
        id,
        name: 'Admin Group',
      } as any);

      const result = await controller.findOne(id);

      expect(result).toEqual({
        id,
        name: 'Admin Group',
      });

      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  // -------------------------
  // PATCH /user-groups/:id
  // -------------------------
  describe('update', () => {
    it('should update a group', async () => {
      const id = 1;
      const dto: UpdateUserGroupDto = {
        name: 'Updated Group',
      } as any;

      service.update.mockResolvedValue({
        id,
        ...dto,
      } as any);

      const result = await controller.update(id, dto);

      expect(result).toEqual({
        id,
        ...dto,
      });

      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  // -------------------------
  // DELETE /user-groups/:id
  // -------------------------
  describe('remove', () => {
    it('should remove a group', async () => {
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
    });
  });
});