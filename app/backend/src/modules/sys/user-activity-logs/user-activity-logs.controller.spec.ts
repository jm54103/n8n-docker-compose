import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityLogsController } from './user-activity-logs.controller';
import { UserActivityLogsService } from './user-activity-logs.service';

describe('UserActivityLogsController', () => {
  let controller: UserActivityLogsController;
  let service: jest.Mocked<UserActivityLogsService>;

  const createMockService = (): jest.Mocked<UserActivityLogsService> =>
    ({
      findAll: jest.fn(),
      findByTarget: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const mockService = createMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActivityLogsController],
      providers: [
        {
          provide: UserActivityLogsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserActivityLogsController>(
      UserActivityLogsController,
    );
    service = module.get(UserActivityLogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // GET /user-activity-logs
  // -------------------------
  describe('findAll', () => {
    it('should return all activity logs', async () => {
      const logs = [
        { id: 1, action: 'CREATE_USER' },
        { id: 2, action: 'UPDATE_USER' },
      ];

      service.findAll.mockResolvedValue(logs as any);

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

  // -------------------------
  // GET /user-activity-logs/target/:table/:id
  // -------------------------
  describe('findDetails', () => {
    it('should return logs by target table and id', async () => {
      const table = 'users';
      const id = '123';

      const logs = [
        { id: 1, table, targetId: id, action: 'UPDATE' },
      ];

      service.findByTarget.mockResolvedValue(logs as any);

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