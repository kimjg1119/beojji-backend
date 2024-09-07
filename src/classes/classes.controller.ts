import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createClassDto: { name: string; courseId: string; term: string; description: string; link: string }) {
    return this.classesService.create({
      data: {
        name: createClassDto.name,
        courseId: createClassDto.courseId,
        term: createClassDto.term,
        description: createClassDto.description,
        link: createClassDto.link,
      },
    });
  }
}