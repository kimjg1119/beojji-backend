import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
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
}