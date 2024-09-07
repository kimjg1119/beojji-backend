import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://59.5.31.39:3000',
    credentials: true,
  });
  app.enableShutdownHooks();
  await app.listen(3001);
}
bootstrap();
