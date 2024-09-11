import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Login')
@Controller('api/auth')
export class LoginController {
  constructor(private authService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password' },
      },
    },
    examples: {
      user: {
        value: {
          email: 'user@example.com',
          password: 'password',
        },
      },
      admin: {
        value: {
          email: 'admin@example.com',
          password: 'password',
        },
      },
    },
    description: 'User credentials',
  })
  async login(@Body() loginDto: { email: string; password: string }): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}