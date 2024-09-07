import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalClasses, totalProblems, totalSubmissions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.class.count(),
      this.prisma.problem.count(),
      this.prisma.submission.count(),
    ]);

    return {
      totalUsers,
      totalClasses,
      totalProblems,
      totalSubmissions,
    };
  }

  async addProblem(createProblemDto: CreateProblemDto) {
    const { title, description, link, classIds } = createProblemDto;

    const problem = await this.prisma.problem.create({
      data: {
        title,
        description,
        link,
        classes: {
          create: classIds.map(classId => ({
            class: { connect: { id: classId } },
            dueDate: new Date() // Set a default due date or add it to the DTO
          }))
        }
      },
    });

    return problem;
  }
}