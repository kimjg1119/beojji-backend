import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'The course ID for the class' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'The name of the class' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The term in which the class is offered' })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({ description: 'A description of the class' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'A link to the class resources or syllabus' })
  @IsUrl()
  @IsOptional()
  link?: string;
}
