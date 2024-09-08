import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: LoginService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<LoginService>(LoginService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (userService.getByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await authService.login({ email: 'test@example.com', password: 'password123' });
      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@example.com', sub: 1 });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      (userService.getByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login({ email: 'test@example.com', password: 'password123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (userService.getByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({ email: 'test@example.com', password: 'wrongpassword' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});