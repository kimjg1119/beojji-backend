import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async createActivity(userId: number, type: string, content: string) {
    return this.prisma.activity.create({
      data: {
        userId,
        type,
        content,
      },
    });
  }

  async getUserActivities(userId: number) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to 10 most recent activities
    });
  }

  async getRecentActivities() {
    return this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}