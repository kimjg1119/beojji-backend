import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Course } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollDto } from './dto/enroll.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        courseProblem: {
          include: {
            problem: true,
          },
        },
      },
    });
  }

  async getOne(id: number): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        courseProblem: {
          include: {
            problem: true,
          },
        },
        user: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async create(params: { data: CreateCourseDto }): Promise<Course> {
    const { data } = params;
    return this.prisma.course.create({
      data: {
        ...data,
      },
    });
  }

  async update(params: { where: Prisma.CourseWhereUniqueInput; data: Prisma.CourseUpdateInput }): Promise<Course> {
    const { where, data } = params;
    return this.prisma.course.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
    return this.prisma.course.delete({
      where,
    });
  }

  async enroll(enrollDto: EnrollDto): Promise<Course> {
    const { courseId, userIds } = enrollDto;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        user: {
          connect: userIds.map(userId => ({ id: userId })),
        },
      },
      include: {
        user: true,
      },
    });
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
}