import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class GetUserDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The student ID of the user' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The role of the user', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
