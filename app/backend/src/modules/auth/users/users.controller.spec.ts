import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const createMockUsersService = (): jest.Mocked<UsersService> => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as any);

  beforeEach(async () => {
    const mockService = createMockUsersService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
      } as any;

      service.create.mockResolvedValue({
        id: 'uuid-123',
        ...dto,
      } as any);

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
      ] as any);

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
      } as any);

      const result = await controller.findOne(id);

      expect(result).toEqual({ id, username: 'John Doe' });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 'uuid-123';
      const dto: UpdateUserDto = { username: 'Jane Doe' };

      service.update.mockResolvedValue({ id, ...dto } as any);

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
      } as any);

      const result = await controller.remove(id);

      expect(result).toEqual({ deleted: true, id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});