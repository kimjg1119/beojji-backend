import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('api')
@Controller('api')
export class ApiController {
  @Get()
  getApiInfo() {
    return {
      message: 'Welcome to the Beojji API',
      version: '1.0.0',
    };
  }
}
