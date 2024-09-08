import { ApiProperty } from '@nestjs/swagger';

export class GetProfileDto {
  @ApiProperty({ description: 'The user ID' })
  id: number;

  @ApiProperty({ description: 'The user email' })
  email: string;

  @ApiProperty({ description: 'The user student ID' })
  studentId: string;

  @ApiProperty({ description: 'The user username' })
  username: string;

  @ApiProperty({ description: 'The user role' })
  role: string;
}
