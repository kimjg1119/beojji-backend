import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async createProblem(problemData: { title: string; description: string; classIds: number[] }) {
    const { title, description, classIds } = problemData;

    // Check if all classes exist
    const classes = await this.prisma.class.findMany({
      where: { id: { in: classIds } },
    });
    if (classes.length !== classIds.length) {
      throw new NotFoundException('One or more classes not found');
    }

    // Create the problem and connect it to the classes
    const problem = await this.prisma.problem.create({
      data: {
        title,
        description,
        classes: {
          connect: classIds.map(id => ({ id })),
        },
      },
      include: { classes: true },
    });

    return problem;
  }

  async getProblem(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: { classes: true },
    });

    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }

    return problem;
  }
}