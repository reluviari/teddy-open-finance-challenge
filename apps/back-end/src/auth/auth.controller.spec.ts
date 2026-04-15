import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    const inputLogin: LoginDto = { email: 'user@teddy.com', password: 'password123' };
    const expectedResponse: LoginResponseDto = {
      accessToken: 'mock-jwt-token',
      name: 'Administrador',
    };

    it('should delegate to AuthService and return the access token', async () => {
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const actual = await controller.login(inputLogin);

      expect(actual).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(inputLogin);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate exceptions thrown by AuthService', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(inputLogin)).rejects.toThrow('Invalid credentials');
    });
  });
});
