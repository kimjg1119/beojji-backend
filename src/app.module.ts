import { Module } from '@nestjs/common';

import { ActivityModule } from './api/activity/activity.module';
import { AdminModule } from './api/admin/admin.module';
import { ProblemModule } from './api/problem/problem.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoleGuard } from './auth/role.guard';
import { SelfActionGuard } from './auth/self-action.guard';
import { LoginModule } from './api/login/login.module';
import { CourseModule } from './api/course/course.module';
import { SubmissionModule } from './api/submission/submission.module';

@Module({
  imports: [
    ActivityModule,
    AdminModule,
    LoginModule,
    CourseModule,
    PrismaModule,
    ProblemModule,
    SubmissionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RoleGuard,
    SelfActionGuard,
  ],
})
export class AppModule { }
