"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
describe('AuthController', () => {
    let controller;
    let authService;
    const mockAuthService = {
        login: jest.fn(),
        refresh: jest.fn(),
        logout: jest.fn(),
        logoutAll: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('login', () => {
        it('should call authService.login and return result', async () => {
            const dto = {
                username: 'test',
                password: '1234',
            };
            const mockRequest = {
                headers: { 'user-agent': 'jest-test' },
            };
            const expectedResult = {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            };
            authService.login.mockResolvedValue(expectedResult);
            const result = await controller.login(dto, mockRequest);
            expect(authService.login).toHaveBeenCalledWith(dto, 'jest-test');
            expect(result).toEqual(expectedResult);
        });
    });
    describe('refresh', () => {
        it('should call authService.refresh', async () => {
            const dto = {
                refreshToken: 'refresh-token',
            };
            const expectedResult = {
                accessToken: 'new-access',
                refreshToken: 'new-refresh-token',
            };
            authService.refresh.mockResolvedValue(expectedResult);
            const result = await controller.refresh(dto);
            expect(authService.refresh).toHaveBeenCalledWith(dto.refreshToken);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('logout', () => {
        it('should call authService.logout with sessionId', async () => {
            const mockRequest = {
                user: {
                    sessionId: 'session-123',
                },
            };
            authService.logout.mockResolvedValue({
                success: true,
            });
            const result = await controller.logout(mockRequest);
            expect(authService.logout).toHaveBeenCalledWith('session-123');
            expect(result).toEqual({ success: true });
        });
    });
    describe('logoutAll', () => {
        it('should call authService.logoutAll with user id', async () => {
            const mockRequest = {
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
//# sourceMappingURL=auth.controller.spec.js.map