import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ミドルウェアの設定
  app.use(helmet());
  // Use Nest's built-in CORS handling to avoid interop issues
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3001;
  await app.listen(port as number);
  console.log(`Murmur app listening on port ${port}!`);
}
bootstrap();
