import { ProblemsService } from './problems.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/problem')
@UseGuards(JwtAuthGuard)
export class ProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Get(':id')
  async getProblem(@Param('id') id: string) {
    return this.problemsService.getProblem(Number(id));
  }

  @Get('/class/:id')
  async getClassProblem(@Param('id') id: string) {
    return this.problemsService.getClassProblem(Number(id));
  }
}