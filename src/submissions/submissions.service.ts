import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async createSubmission(userId: number, classProblemId: number, code: string) {

    // Check if the submission is before the due date
    const classProblem = await this.prisma.classProblem.findUnique({
      where: { id: classProblemId },
      select: { dueDate: true },
    });

    if (!classProblem) {
      throw new Error('Class problem not found');
    }

    const currentTime = new Date();
    const dueDate = new Date(classProblem.dueDate);

    if (currentTime > dueDate) {
      throw new Error('Submission time has passed the due date');
    }

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        classProblemId,
        code,
        status: 'PENDING',
      },
    });

    // Create activity for the submission
    await this.activityService.createActivity(
      userId,
      'SUBMISSION',
      `Submitted a solution for problem #${classProblemId}`
    );

    return submission;
  }

  async getMySubmissions(userId: number) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: {
        classProblem: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                courseId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubmissionById(id: number) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        classProblem: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                courseId: true,
              },
            },
          },
        },
      },
    });
  }
}