import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ProblemService.name);

  async createProblem(createProblemDto: CreateProblemDto) {
    const problem = await this.prisma.problem.create({
      data: {
        ...createProblemDto,
      },
    });
    return problem;
  }

  async getProblem(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
    });
    return problem;
  }

  async getCourseProblem(id: number) {
    const courseProblem = await this.prisma.courseProblem.findUnique({
      where: { id },
      include: {
        problem: true,
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const readme = await this.fetchReadmeFromGitHub(courseProblem.problem.link);
    await this.prisma.problem.update({
      where: { id: courseProblem.problemId },
      data: { readme },
    });

    return courseProblem;
  }

  private async fetchReadmeFromGitHub(repoUrl: string): Promise<string | null> {
    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/[^/]+)?\/?(.*)/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }

      const [, owner, repo, path] = match;
      let readmePath = path ? `${path}/README.md` : 'README.md';
      readmePath = readmePath.replace(/^\//, '');

      const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${readmePath}`;
      this.logger.log(`Fetching README from: ${readmeUrl}`);
      
      const response = await axios.get(readmeUrl, {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching README from GitHub:', error);
      return null;
    }
  }
}

