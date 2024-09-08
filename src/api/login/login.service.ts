import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../auth/constants';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userService.getByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    this.logger.debug('Generated full token:', token);
    return {
      access_token: token,
    };
  }
}