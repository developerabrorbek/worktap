import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from '@config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: '125mb' }));
  app.disable('x-powered-by', 'X-Powered-By', 'etag');

  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Worktap API')
    .setDescription('The worktap API description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
