import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/roles.decorator';
import { AdminService } from './admin.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Role('admin')
  @ApiOperation({ summary: 'Get statistics for admin dashboard', description: 'Retrieves various statistics for the admin dashboard, including user counts, course information, and other relevant metrics.' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns statistics for the admin dashboard',
    schema: {
      properties: {
        totalUsers: { type: 'number', description: 'Total number of registered users' },
        totalCourses: { type: 'number', description: 'Total number of courses' },
        totalProblems: { type: 'number', description: 'Total number of problems' },
        totalSubmissions: { type: 'number', description: 'Total number of submissions' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have admin role' })
  async getStats() {
    return this.adminService.getStats();
  }
}