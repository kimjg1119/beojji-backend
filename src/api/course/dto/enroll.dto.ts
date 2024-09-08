import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EnrollDto {
  @ApiProperty({ description: 'The ID of the course to enroll in' })
  courseId: number;

  @ApiProperty({ description: 'An array of user IDs to enroll', type: [Number] })
  userIds: number[];
}
