import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'jwt_token' };

      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      (authService.login as jest.Mock).mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});