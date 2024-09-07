import { Controller, Post, Body, UseGuards, Req, Get, Param, ForbiddenException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../types/types';

@Controller('api/submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  async createSubmission(@Req() req: RequestWithUser, @Body() submissionData: { classProblemId: number; code: string }) {
    const userId = req.user.userId;
    return this.submissionsService.createSubmission(userId, submissionData.classProblemId, submissionData.code);
  }

  @Get('my')
  async getMySubmissions(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.submissionsService.getMySubmissions(userId);
  }

  @Get(':id')
  async getSubmission(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    const submission = await this.submissionsService.getSubmissionById(parseInt(id, 10));
    if (submission.userId !== userId && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to access this submission');
    }
    return submission;
  }
}