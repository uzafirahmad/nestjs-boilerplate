import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes should be set up before the application starts listening
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw errors when non-whitelisted values are provided
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    disableErrorMessages: false, // Set to true in production to prevent leaking validation details
  }));

  await app.listen(3000);
}
bootstrap();

