import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const classItem = await this.prisma.class.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
        users: true,
      },
    });

    if (!classItem) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classItem;
  }

  async create(params: { data: Prisma.ClassCreateInput }) {
    const { data } = params;
    return this.prisma.class.create({
      data,
    });
  }

  async update(params: { where: Prisma.ClassWhereUniqueInput; data: Prisma.ClassUpdateInput }) {
    const { where, data } = params;
    return this.prisma.class.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ClassWhereUniqueInput) {
    return this.prisma.class.delete({
      where,
    });
  }
}