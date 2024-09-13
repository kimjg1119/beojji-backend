import { ApiProperty } from '@nestjs/swagger';

export class GetProblemDto {
  @ApiProperty({ description: 'The ID of the problem' })
  id: number;

  @ApiProperty({ description: 'The title of the problem' })
  title: string;

  @ApiProperty({ description: 'The description of the problem' })
  description: string;

  @ApiProperty({ description: 'A link to the problem resources or additional information' })
  link: string;

  @ApiProperty({ description: 'The README content of the problem', required: false })
  readme?: string;

  @ApiProperty({ description: 'The package name for the problem', required: false })
  package?: string;

  @ApiProperty({ description: 'The timestamp when the problem was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the problem was last updated' })
  updatedAt: Date;
}
