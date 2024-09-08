import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ActivityModule } from './activity/activity.module';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { CourseModule } from './course/course.module';
import { ProblemModule } from './problem/problem.module';
import { SubmissionModule } from './submission/submission.module';
import { UserModule } from './user/user.module';
import { ApiController } from './api.controller';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api',
        children: [
          { path: 'activity', module: ActivityModule },
          { path: 'admin', module: AdminModule },
          { path: 'auth', module: LoginModule },
          { path: 'course', module: CourseModule },
          { path: 'problem', module: ProblemModule },
          { path: 'submission', module: SubmissionModule },
          { path: 'users', module: UserModule },
        ],
      },
    ]),
    ActivityModule,
    AdminModule,
    LoginModule,
    CourseModule,
    ProblemModule,
    SubmissionModule,
    UserModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
