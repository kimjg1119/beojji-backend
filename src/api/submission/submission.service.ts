import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { use } from 'passport';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  private readonly logger = new Logger(SubmissionService.name);

  async createSubmission(userId: number, submissionData: { courseProblemId: number; code: string }) {
    const { courseProblemId, code } = submissionData;
    this.logger.log(`Creating ${userId}'s submission for course problem ${courseProblemId} with code length ${code.length}`);

    const courseProblem = await this.prisma.courseProblem.findUnique({
      where: { id: courseProblemId },
      select: { dueDate: true },
    });

    if (!courseProblem) {
      throw new Error('Course problem not found');
    }

    const currentTime = new Date();
    const dueDate = new Date(courseProblem.dueDate);

    if (currentTime > dueDate) {
      throw new Error('Submission time has passed the due date');
    }

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        courseProblemId,
        code,
        status: 'PENDING',
      },
    });

    // Create activity for the submission
    await this.activityService.createActivity(
      userId,
      'SUBMISSION',
      `Submitted a solution for problem #${courseProblemId}`
    );

    return submission;
  }

  async getMySubmissions(userId: number) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: {
        courseProblem: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
              },
            },
            course: {
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
        courseProblem: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
              },
            },
            course: {
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