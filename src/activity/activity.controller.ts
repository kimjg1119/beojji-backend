import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/admin/activities')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('')
  async getRecentActivities() {
    return this.activityService.getRecentActivities();
  }
}