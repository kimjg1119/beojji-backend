import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/problem')
@UseGuards(JwtAuthGuard)
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  // Remove the createProblem method

  @Get(':id')
  async getProblem(@Param('id') id: string) {
    return this.problemService.getProblem(Number(id));
  }

  @Get('/class/:id')
  async getClassProblem(@Param('id') id: string) {
    return this.problemService.getClassProblem(Number(id));
  }
}