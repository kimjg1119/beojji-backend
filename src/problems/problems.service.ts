import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProblemsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProblem(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return problem;
  }

  async getClassProblem(id: number) {
    const classProblem = await this.prisma.classProblem.findUnique({
      where: { id },
    });

    if (!classProblem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return classProblem;
  }
}