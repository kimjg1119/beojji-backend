import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { downloadTemplate, grade } from './grade';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';

@Injectable()
@Processor('grader')
export class GraderQueue {
  private readonly logger = new Logger(GraderQueue.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('grader') private graderQueue: Queue
  ) {}

  async addToQueue(submissionId: number) {
    await this.graderQueue.add('grade', { submissionId });
  }

  @Process('grade')
  private async processJob(job: Job<{ submissionId: number }>) {
    const { submissionId } = job.data;
    await this.gradeSubmission(submissionId);
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
    //   downloadTemplate(submission.courseProblem.problem.package);
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
