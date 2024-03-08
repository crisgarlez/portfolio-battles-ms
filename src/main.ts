import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const AMQP_HOST = configService.get<string>('AMQP_URL');
  const QUEUE_NAME = configService.get<string>('BATTLES_MS_QUEUE_NAME');
  const PORT = configService.get<string>('PORT');

  logger.debug('PORT:', PORT);
  logger.debug('AMQP_HOST:', AMQP_HOST);
  logger.debug('QUEUE_NAME:', QUEUE_NAME);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [AMQP_HOST],
      queue: QUEUE_NAME,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
