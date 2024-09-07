import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/problem')
@UseGuards(JwtAuthGuard)
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createProblem(@Body() problemData: { 
    title: string; 
    description: string; 
    link: string; 
    classIds: number[] 
  }) {
    return this.problemService.createProblem(problemData);
  }

  @Get(':id')
  async getProblem(@Param('id') id: string) {
    return this.problemService.getProblem(Number(id));
  }

  @Get('/class/:id')
  async getClassProblem(@Param('id') id: string) {
    return this.problemService.getClassProblem(Number(id));
  }

}