import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';
import { BullModule } from '@nestjs/bull';
import { GraderQueue } from '../../grader/grader-queue'; // Add this import

@Module({
  imports: [
    PrismaModule,
    ActivityModule,
    BullModule.registerQueue({ name: 'grader' })
  ],
  providers: [SubmissionService, GraderQueue], // Add GraderQueue here
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}