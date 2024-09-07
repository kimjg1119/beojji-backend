import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(submissionData: { userId: number; classProblemId: number; code: string }) {
    const { userId, classProblemId, code } = submissionData;

    // Check if the classProblem exists
    const classProblem = await this.prisma.classProblem.findUnique({
      where: { id: classProblemId },
      include: { problem: true },
    });

    if (!classProblem) {
      throw new NotFoundException(`ClassProblem with ID ${classProblemId} not found`);
    }

    // Create the submission
    const submission = await this.prisma.submission.create({
      data: {
        user: { connect: { id: userId } },
        classProblem: { connect: { id: classProblemId } },
        code,
        status: 'pending', // You might want to implement a judge system to update this status
      },
      include: {
        classProblem: {
          include: {
            problem: true,
          },
        },
      },
    });

    return submission;
  }

  async getSubmissionsForUser(userId: number) {
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      include: {
        classProblem: {
          include: {
            problem: true,
            class: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map(submission => ({
      id: submission.id,
      problemId: submission.classProblem.problem.id,
      problemTitle: submission.classProblem.problem.title,
      className: submission.classProblem.class.name,
      code: submission.code,
      status: submission.status,
      createdAt: submission.createdAt,
    }));
  }
}