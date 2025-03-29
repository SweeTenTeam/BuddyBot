import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq'],
        queue: 'chatbot-queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  console.log('Microservice created, starting to listen...');
  await app.listen();
  console.log('Microservice is now listening for messages');
}
bootstrap();