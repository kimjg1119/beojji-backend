import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(submissionData: { userId: number; problemId: number; code: string }) {
    const { userId, problemId, code } = submissionData;

    // Check if the problem exists
    const problem = await this.prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${problemId} not found`);
    }

    // Create the submission
    const submission = await this.prisma.submission.create({
      data: {
        user: { connect: { id: userId } },
        problem: { connect: { id: problemId } },
        code,
        status: 'PENDING', // You might want to implement a judge system to evaluate submissions
      },
    });

    return submission;
  }

  async getSubmissionsByUser(userId: number) {
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      include: {
        problem: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return submissions.map(submission => ({
      id: submission.id,
      problemId: submission.problemId,
      problemTitle: submission.problem.title,
      code: submission.code,
      status: submission.status,
      createdAt: submission.createdAt
    }));
  }
}