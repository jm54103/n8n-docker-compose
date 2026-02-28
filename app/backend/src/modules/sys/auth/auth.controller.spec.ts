import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    logoutAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // LOGIN
  // -----------------------------
  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto: LoginDto = {
        username: 'test',
        password: '1234',
      };

      const mockRequest: any = {
        headers: { 'user-agent': 'jest-test' },
      };

      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      authService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto, mockRequest);

      expect(authService.login).toHaveBeenCalledWith(
        dto,
        'jest-test',
      );

      expect(result).toEqual(expectedResult);
    });
  });

  // -----------------------------
  // REFRESH
  // -----------------------------
  describe('refresh', () => {
    it('should call authService.refresh', async () => {
      const dto: RefreshDto = {
        refreshToken: 'refresh-token',
      };   

      const expectedResult = {
        accessToken: 'new-access',
        refreshToken: 'new-refresh-token',
      };

      authService.refresh.mockResolvedValue(expectedResult);

      const result = await controller.refresh(dto);

      expect(authService.refresh).toHaveBeenCalledWith(
        dto.refreshToken,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  // -----------------------------
  // LOGOUT
  // -----------------------------
  describe('logout', () => {
    it('should call authService.logout with sessionId', async () => {
      const mockRequest: any = {
        user: {
          sessionId: 'session-123',
        },
      };

      authService.logout.mockResolvedValue({
        success: true,
      });

      const result = await controller.logout(mockRequest);

      expect(authService.logout).toHaveBeenCalledWith(
        'session-123',
      );

      expect(result).toEqual({ success: true });
    });
  });

  // -----------------------------
  // LOGOUT ALL
  // -----------------------------
  describe('logoutAll', () => {
    it('should call authService.logoutAll with user id', async () => {
      const mockRequest: any = {
        user: {
          sub: 99,
        },
      };

      authService.logoutAll.mockResolvedValue({
        success: true,
      });

      const result = await controller.logoutAll(mockRequest);

      expect(authService.logoutAll).toHaveBeenCalledWith(99);

      expect(result).toEqual({ success: true });
    });
  });
});