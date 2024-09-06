import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  async createSubmission(@Req() req, @Body() submissionData: { problemId: number; code: string }) {
    const userId = req.user.userId;
    return this.submissionsService.createSubmission({ ...submissionData, userId });
  }

  @Get('my')
  async getMySubmissions(@Req() req) {
    const userId = req.user.userId;
    return this.submissionsService.getSubmissionsByUser(userId);
  }
}