import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessLogsController } from './user-access-logs.controller';
import { UserAccessLogsService } from './user-access-logs.service';

describe('UserAccessLogsController', () => {
  let controller: UserAccessLogsController;
  let service: jest.Mocked<UserAccessLogsService>;

  const createMockService = (): jest.Mocked<UserAccessLogsService> =>
    ({
      findAll: jest.fn(),
      findByUserId: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const mockService = createMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccessLogsController],
      providers: [
        {
          provide: UserAccessLogsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserAccessLogsController>(
      UserAccessLogsController,
    );
    service = module.get(UserAccessLogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // GET /user-access-logs?limit=xx
  // -------------------------
  describe('findAll', () => {
    it('should return logs with limit', async () => {
      const limit = 10;

      const logs = [
        { id: 1, action: 'LOGIN' },
        { id: 2, action: 'LOGOUT' },
      ];

      service.findAll.mockResolvedValue(logs as any);

      const result = await controller.findAll(limit);

      expect(result).toEqual(logs);
      expect(service.findAll).toHaveBeenCalledWith(limit);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return logs without limit', async () => {
      const logs = [{ id: 1, action: 'LOGIN' }];

      service.findAll.mockResolvedValue(logs as any);

      const result = await controller.findAll();

      expect(result).toEqual(logs);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  // -------------------------
  // GET /user-access-logs/user/:userId
  // -------------------------
  describe('findByUser', () => {
    it('should return logs for a user', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';

      const logs = [
        { id: 1, action: 'LOGIN', userId },
      ];

      service.findByUserId.mockResolvedValue(logs as any);

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