import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Beojji API')
    .setDescription('API for Beojji')
    .setVersion('0.1')
    .addTag('beojji')
    .addBearerAuth() // Add this line
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://59.5.31.39:3000',
    credentials: true,
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3001);
}
bootstrap();
