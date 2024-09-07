import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsArray()
  @IsNumber({}, { each: true })
  classIds: number[];
}