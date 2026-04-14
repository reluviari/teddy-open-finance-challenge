import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    const inputLogin = { email: 'user@teddy.com', password: 'password123' };

    it('should return an access token for valid credentials', async () => {
      const mockUser = {
        id: 'uuid-1',
        email: inputLogin.email,
        password: await bcrypt.hash(inputLogin.password, 10),
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const actual = await service.login(inputLogin);

      expect(actual).toEqual({ accessToken: 'mock-jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(inputLogin)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 'uuid-1',
        email: inputLogin.email,
        password: await bcrypt.hash('wrong-password', 10),
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(inputLogin)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('seedDefaultUser', () => {
    it('should create a default user when no users exist', async () => {
      mockUserRepository.count.mockResolvedValue(0);
      mockUserRepository.create.mockReturnValue({ email: 'admin@teddy.com' });
      mockUserRepository.save.mockResolvedValue({});

      await service.seedDefaultUser();

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'admin@teddy.com' }),
      );
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should skip seeding when users already exist', async () => {
      mockUserRepository.count.mockResolvedValue(1);

      await service.seedDefaultUser();

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
