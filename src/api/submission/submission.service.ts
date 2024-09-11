import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { GraderQueue } from '../../grader/grader-queue';
import { GetSubmissionDto } from './dto/get-submission.dto';

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
    private graderQueue: GraderQueue
  ) {}

  async createSubmission(userId: number, submissionData: { courseProblemId: number; code: string }) {
    const { courseProblemId, code } = submissionData;
    this.logger.log(`Creating submission for user ${userId}, course problem ${courseProblemId}`);

    await this.validateSubmission(courseProblemId);

    const submission = await this.saveSubmission(userId, courseProblemId, code);
    await this.processSubmission(submission.id, userId, courseProblemId);

    return submission;
  }

  async getMySubmissions(userId: number): Promise<GetSubmissionDto[]> {
    const submissions = await this.fetchUserSubmissions(userId);
    return submissions.map(this.mapSubmissionToDto);
  }

  async getSubmissionById(id: number): Promise<GetSubmissionDto> {
    const submission = await this.fetchSubmissionById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return this.mapSubmissionToDto(submission);
  }

  private async validateSubmission(courseProblemId: number): Promise<void> {
    const courseProblem = await this.prisma.courseProblem.findUnique({
      where: { id: courseProblemId },
      select: { dueDate: true },
    });

    if (!courseProblem) {
      throw new NotFoundException('Course problem not found');
    }

    if (new Date() > new Date(courseProblem.dueDate)) {
      throw new Error('Submission time has passed the due date');
    }
  }

  private async saveSubmission(userId: number, courseProblemId: number, code: string) {
    return this.prisma.submission.create({
      data: { userId, courseProblemId, code, status: 'PENDING' },
    });
  }

  private async processSubmission(submissionId: number, userId: number, courseProblemId: number): Promise<void> {
    this.graderQueue.addToQueue(submissionId);
    await this.activityService.createActivity(
      userId,
      'SUBMISSION',
      `Submitted a solution for problem #${courseProblemId}`
    );
  }

  private async fetchUserSubmissions(userId: number) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: this.getSubmissionInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  private async fetchSubmissionById(id: number) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: this.getSubmissionInclude(),
    });
  }

  private getSubmissionInclude() {
    return {
      courseProblem: {
        include: {
          problem: { select: { id: true, title: true } },
          course: { select: { id: true, name: true, courseId: true } },
        },
      },
    };
  }

  private mapSubmissionToDto(submission: any): GetSubmissionDto {
    return {
      id: submission.id,
      userId: submission.userId,
      courseProblemId: submission.courseProblemId,
      code: submission.code,
      status: submission.status,
      score: submission.score,
      detail: submission.detail,
      createdAt: submission.createdAt,
    };
  }
}