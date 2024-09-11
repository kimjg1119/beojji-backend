import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCourseDto {
  @ApiProperty({ description: 'The unique identifier of the course' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The course ID for the course' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'The name of the course' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The term in which the course is offered' })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({ description: 'A description of the course' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'A link to the course resources or syllabus' })
  @IsString()
  @IsOptional()
  link?: string;
}
