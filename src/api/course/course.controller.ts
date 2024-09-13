import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/requests';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/roles.decorator';
import { SelfActionGuard } from 'src/auth/self-action.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollDto } from './dto/enroll.dto';
import { GetCourseDto } from './dto/get-course.dto';

@ApiTags('Course')
@Controller('api/course')
@UsePipes(new ValidationPipe({ transform: true }))
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses', description: 'Retrieves a list of all available courses.' })
  @ApiResponse({ status: 200, description: 'Returns all courses', type: [GetCourseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAll(): Promise<GetCourseDto[]> {
    return this.courseService.getAll();
  }
  
  @Get('me')
  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the courses of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns the user courses', type: [GetCourseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized - User is not authenticated' })
  async getUserCourse(@Req() req: RequestWithUser): Promise<GetCourseDto[]> {
    return this.courseService.getUserCourse(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'The course has been successfully retrieved', type: GetCourseDto })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCourse(@Param('id') id: string): Promise<GetCourseDto> {
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
      COSE101: {
        value: {
          courseId: "COSE101",
          name: "Introduction to Computer Science",
          term: "Fall 2024",
          description: "An introductory course covering fundamental concepts of computer science.",
          link: "https://example.com/intro-cs"
        }
      },
      MATH201: {
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