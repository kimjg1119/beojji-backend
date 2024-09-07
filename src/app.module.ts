import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { ProblemModule } from './problem/problem.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AdminModule } from './admin/admin.module';
import { AdminGuard } from './auth/admin.guard';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ClassesModule,
    EnrollmentModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ProblemModule,
    SubmissionsModule,
    AdminModule,
    ActivityModule
  ],
  controllers: [AppController],
  providers: [AppService, AdminGuard],
})
export class AppModule {}
