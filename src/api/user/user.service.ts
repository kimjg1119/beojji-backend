import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetProfileDto } from './dto/get-profile.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) { }

  async createUser(createUserDto: CreateUserDto) {
    const SALT_ROUNDS = 10;
    const { email, studentId, username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return this.prisma.user.create({
      data: { email, studentId, username, password: hashedPassword },
    });
  }

  async getAllUser() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, studentId: true, role: true, username: true },
    });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserbyId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, studentId: true, role: true, username: true }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserCourse(userId: number) {
    const userWithCourses = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        course: {
          include: {
            courseProblem: {
              select: {
                id: true,
                dueDate: true,
                problem: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    link: true
                  }
                },
              }
            }
          }
        }
      }
    });

    if (!userWithCourses) {
      throw new NotFoundException('User not found');
    }

    return userWithCourses.course;
  }

  async getProfile(userId: number): Promise<GetProfileDto> {
    const user = await this.getUserbyId(userId);
    return {
      id: user.id,
      email: user.email,
      studentId: user.studentId,
      username: user.username,
      role: user.role
    };
  }
}

