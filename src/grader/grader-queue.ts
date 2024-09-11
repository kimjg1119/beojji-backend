import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { downloadTemplate, grade } from './grade';

@Injectable()
export class GraderQueue implements OnModuleInit {
  private queue: number[] = [];
  private isProcessing: boolean = false;
  private readonly logger = new Logger(GraderQueue.name);

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.startProcessingLoop();
  }

  addToQueue(submissionId: number) {
    this.queue.push(submissionId);
  }

  private async startProcessingLoop() {
    while (true) {
      if (this.queue.length > 0 && !this.isProcessing) {
        await this.processQueue();
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const submissionId = this.queue.shift();
      await this.gradeSubmission(submissionId);
    }

    this.isProcessing = false;
  }

  private async gradeSubmission(submissionId: number) {
    try {
      const submission = await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          courseProblem: {
            include: {
              problem: true,
              course: true,
            },
          },
        },
      });

      if (!submission) {
        this.logger.error(`Submission ${submissionId} not found`);
        return;
      }

      this.logger.log(`Grading submission ${submissionId}: ${submission.courseProblem.problem.package}`);
      downloadTemplate(submission.courseProblem.problem.package);
      const result = grade(submission.courseProblem.problem.package, submission.code);

      await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: result.verdict,
          score: result.score,
          detail: result.detail,
        },
      });

      this.logger.log(`Graded submission ${submissionId}: ${result.verdict}, Score: ${result.score}`);
    } catch (error) {
      this.logger.error(`Error grading submission ${submissionId}: ${error.message}`);
    }
  }
}
