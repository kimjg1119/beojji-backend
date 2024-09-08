import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateProblemDto {
  @ApiProperty({ description: 'The title of the problem' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the problem' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'A link to the problem resources or additional information' })
  @IsUrl()
  @IsNotEmpty()
  link: string;
}
