import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollUserDto } from '../dto/enroll-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // Assuming you have an AdminGuard

@Controller('api/enrollment')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);

  constructor(private enrollmentService: EnrollmentService) {}

  @Post('enroll')
  async enrollUser(@Body() enrollUserDto: EnrollUserDto) {
    this.logger.debug(`Enrolling user: ${JSON.stringify(enrollUserDto)}`);
    try {
      const result = await this.enrollmentService.enrollUser(enrollUserDto);
      this.logger.log(`User enrolled successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error enrolling user: ${error.message}`, error.stack);
      throw error;
    }
  }
}