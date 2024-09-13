import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class EnrollDto {
  @ApiProperty({
    description: 'The ID of the course to enroll in',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description: 'An array of user IDs to enroll in the course',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
