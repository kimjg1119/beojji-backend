import { Controller, Get, Post, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollDto } from './dto/enroll.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { Role } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('Course')
@Controller('api/course')
@UsePipes(new ValidationPipe({ transform: true }))
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses', description: 'Retrieves a list of all available courses.' })
  @ApiResponse({ status: 200, description: 'Returns all courses', type: [CreateCourseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAll() {
    return this.courseService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID', description: 'Retrieves a specific course by its ID.' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the course to retrieve' })
  @ApiResponse({ status: 200, description: 'Returns the course', type: CreateCourseDto })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.courseService.getOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @ApiOperation({ summary: 'Create a new course', description: 'Creates a new course with the provided details.' })
  @ApiBody({
    type: CreateCourseDto,
    description: 'The course details to create',
    examples: {
      example1: {
        value: {
          courseId: "COSE101",
          name: "Introduction to Computer Science",
          term: "Fall 2024",
          description: "An introductory course covering fundamental concepts of computer science.",
          link: "https://example.com/intro-cs"
        }
      },
      example2: {
        value: {
          courseId: "MATH201",
          name: "Linear Algebra",
          term: "Spring 2025",
          description: "A comprehensive study of linear algebra and its applications.",
          link: "https://example.com/linear-algebra"
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The course has been successfully created', type: CreateCourseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create({ data: createCourseDto });
  }

  @Post('enroll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @ApiOperation({ 
    summary: 'Enroll users in a course', 
    description: 'Enrolls one or more users in a specific course.' 
  })
  @ApiBody({ type: EnrollDto, description: 'The enrollment details' })
  @ApiResponse({ status: 200, description: 'Users have been successfully enrolled' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  enroll(@Body() enrollDto: EnrollDto) {
    return this.courseService.enroll(enrollDto);
  }
}