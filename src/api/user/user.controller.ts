import { Controller, Post, Body, BadRequestException, Logger, Get, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestWithUser } from 'src/auth/requests';
import { GetProfileDto } from './dto/get-profile.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { SelfActionGuard } from 'src/auth/self-action.guard';

@Controller('api/user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users', type: [GetUserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  async getAllUser() {
    return this.usersService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  async getProfile(@Req() req: RequestWithUser): Promise<GetProfileDto> {
    return this.usersService.getProfile(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user', type: GetUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have admin role' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserbyId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have admin role' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }


}