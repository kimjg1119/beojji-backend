import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { ProblemsModule } from './problems/problems.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    EnrollmentModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    ProblemsModule,
    SubmissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
