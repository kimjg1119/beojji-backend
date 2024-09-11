import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';
import { GraderQueue } from '../../grader/grader-queue';

@Module({
  imports: [PrismaModule, ActivityModule],
  providers: [SubmissionService, GraderQueue],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}