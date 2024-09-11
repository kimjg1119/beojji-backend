import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../auth/requests';
import { SelfActionGuard } from '../../auth/self-action.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SubmissionService } from './submission.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { GetSubmissionDto } from './dto/get-submission.dto';

@ApiTags('Submission')
@ApiBearerAuth()
@Controller('api/submission')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post()
  @UseGuards(SelfActionGuard)
  @ApiOperation({ summary: 'Create a new submission' })
  @ApiBody({ 
    description: 'Submission data',
    schema: {
      type: 'object',
      properties: {
        classProblemId: { type: 'number' },
        code: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubmission(@Req() req: RequestWithUser, @Body() submissionData: { courseProblemId: number; code: string }) {
    const userId = req.user.id;
    return this.submissionService.createSubmission(userId, submissionData);
  }

  @Get('me')
  @UseGuards(SelfActionGuard)
  @ApiOperation({ summary: 'Get current user\'s submissions' })
  @ApiResponse({ status: 200, description: 'Returns a list of user\'s submissions', type: [GetSubmissionDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMySubmissions(@Req() req: RequestWithUser): Promise<GetSubmissionDto[]> {
    const userId = req.user.id;
    return this.submissionService.getMySubmissions(userId);
  }

  @Get(':id')
  @UseGuards(SelfActionGuard)
  @ApiOperation({ summary: 'Get a specific submission' })
  @ApiParam({ name: 'id', type: 'string', description: 'Submission ID' })
  @ApiResponse({ status: 200, description: 'Returns the requested submission', type: GetSubmissionDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async getSubmission(@Param('id') id: string, @Req() req: RequestWithUser): Promise<GetSubmissionDto> {
    return this.submissionService.getSubmissionById(parseInt(id, 10));
  }
}