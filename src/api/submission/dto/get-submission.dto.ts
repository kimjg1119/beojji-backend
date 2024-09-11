import { ApiProperty } from '@nestjs/swagger';
import { Verdict } from '../../../grader/grade';

export class GetSubmissionDto {
  @ApiProperty({ description: 'The ID of the submission' })
  id: number;

  @ApiProperty({ description: 'The ID of the user who made the submission' })
  userId: number;

  @ApiProperty({ description: 'The ID of the course problem' })
  courseProblemId: number;

  @ApiProperty({ description: 'The submitted code' })
  code: string;

  @ApiProperty({ 
    description: 'The status of the submission',
    enum: Verdict,
    enumName: 'Verdict'
  })
  status: Verdict;

  @ApiProperty({ description: 'The score of the submission' })
  score: number;

  @ApiProperty({ description: 'The details of the submission result' })
  detail: string;

  @ApiProperty({ description: 'The timestamp of when the submission was created' })
  createdAt: Date;
}
