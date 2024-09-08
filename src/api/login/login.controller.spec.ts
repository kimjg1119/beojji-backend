import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginController', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'jwt_token' };

      (loginService.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await loginController.login(loginDto);
      expect(result).toEqual(expectedResult);
      expect(loginService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      (loginService.login as jest.Mock).mockRejectedValue(new UnauthorizedException());

      await expect(loginController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});