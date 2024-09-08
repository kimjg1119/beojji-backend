import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Problem')
@Controller('api/problem')
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new problem' })
  @ApiResponse({ status: 201, description: 'Problem created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have admin role' })
  async createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.createProblem(createProblemDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a problem by ID' })
  @ApiResponse({ status: 200, description: 'Returns the problem' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  async getProblem(@Param('id') id: string) {
    return this.problemService.getProblem(Number(id));
  }

  @Get('/course/:id')
  @ApiOperation({ summary: 'Get problems by course ID' })
  @ApiResponse({ status: 200, description: 'Returns the problems' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Problems not found' })
  async getCourseProblem(@Param('id') id: string) {
    return this.problemService.getCourseProblem(Number(id));
  }
}