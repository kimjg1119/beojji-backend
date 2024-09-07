import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async getProblem(id: number) {
    const classProblem = await this.prisma.classProblem.findUnique({
      where: { id },
      include: {
        problem: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!classProblem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }

    if(classProblem.problem.readme === null) {
      const readme = await this.fetchReadmeFromGitHub(classProblem.problem.link);
      await this.prisma.problem.update({
        where: { id: classProblem.problem.id },
        data: { readme },
      });
    }

    return classProblem;
  }

  async getClassProblem(id: number) {
    const classProblem = await this.prisma.classProblem.findUnique({
      where: { id },
      include: {
        problem: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if(classProblem.problem.readme === null) {
      const readme = await this.fetchReadmeFromGitHub(classProblem.problem.link);
      await this.prisma.problem.update({
        where: { id: classProblem.problem.id },
        data: { readme },
      });
    }

    return classProblem;
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
      console.log('Fetching README from:', readmeUrl);
      
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

