import { Controller, Get, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/classes')
export class ClassesController {
  private readonly logger = new Logger(ClassesController.name);

  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllClasses() {
    const classes = await this.prisma.class.findMany({
      select: { id: true, name: true },
    });
    return classes;
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addClass(@Body() data: { name: string }) {
    this.logger.debug(`Adding new class: ${data.name}`);
    const newClass = await this.prisma.class.create({
      data: {
        name: data.name,
      },
    });
    this.logger.debug(`Class added successfully: ${newClass.id}`);
    return newClass;
  }
}