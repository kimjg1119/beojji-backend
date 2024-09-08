import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/roles.decorator';
import { ActivityService } from './activity.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('api/activity')
@UseGuards(JwtAuthGuard, RoleGuard)
@Role('admin')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ status: 200, description: 'Returns recent activities' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have admin role' })
  async getRecentActivities() {
    return this.activityService.getRecentActivities();
  }
}