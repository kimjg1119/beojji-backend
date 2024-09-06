import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/problems')
@UseGuards(JwtAuthGuard)
export class ProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createProblem(@Body() problemData: { title: string; description: string; classIds: number[] }) {
    return this.problemsService.createProblem(problemData);
  }

  @Get(':id')
  async getProblem(@Param('id') id: string) {
    return this.problemsService.getProblem(Number(id));
  }
}