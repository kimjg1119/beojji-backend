import { IsNumber, IsArray } from 'class-validator';

export class EnrollUserDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  classIds: number[];
}