import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalClasses, totalProblems, totalSubmissions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
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
}