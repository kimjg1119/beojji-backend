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

@Module({
  imports: [
    ClassesModule,
    EnrollmentModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ProblemModule,
    SubmissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
