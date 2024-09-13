import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Course } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCourseDto } from './dto/get-course.dto';
import { EnrollDto } from './dto/enroll.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<GetCourseDto[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        courseProblem: {
          include: {
            problem: true,
          },
        },
      },
    });

    return courses.map(this.mapCourseToDto);
  }

  async getOne(id: number): Promise<GetCourseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        courseProblem: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.mapCourseToDto(course);
  }

  private mapCourseToDto(course: any): GetCourseDto {
    return {
      id: course.id,
      courseId: course.courseId,
      name: course.name,
      term: course.term,
      description: course.description,
      link: course.link,
      problems: course.courseProblem.map(cp => ({
        id: cp.problem.id,
        title: cp.problem.title,
        description: cp.problem.description,
        link: cp.problem.link,
        dueDate: cp.dueDate.toISOString(),
      })),
    };
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

  async getUserCourse(userId: number): Promise<GetCourseDto[]> {
    const userWithCourses = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        course: {
          include: {
            courseProblem: {
              include: {
                problem: true,
              },
            },
          }
        }
      }
    });

    if (!userWithCourses) {
      throw new NotFoundException('User not found');
    }

    return userWithCourses.course.map(this.mapCourseToDto);
  }
}