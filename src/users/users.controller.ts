import { Controller, Post, Body, BadRequestException, Logger, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  async createUser(@Body() userData: { name: string; email: string; studentId: string; password: string }) {
    this.logger.log(`Attempting to create user with email: ${userData.email}`);
    if (!userData.name || !userData.email || !userData.studentId || !userData.password) {
      this.logger.warn('Registration attempt with missing fields');
      throw new BadRequestException('Name, email, student ID, and password are required');
    }
    try {
      const newUser = await this.usersService.createUser(userData);
      this.logger.log(`User created successfully: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    this.logger.debug('getProfile called');
    this.logger.debug('User from request:', req.user);

    const user = await this.usersService.findById(req.user.userId);
    this.logger.debug('User found:', user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/classes')
  async getUserClasses(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.getUserClasses(userId);
  }
}