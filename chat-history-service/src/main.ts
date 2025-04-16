import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log('Starting history-service...');
  console.log('RabbitMQ URL:', process.env.RABBITMQ_URL || 'amqp://rabbitmq');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq'],
        queue: 'history-queue',
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

bootstrap().catch(error => {
  console.error('Failed to start microservice:', error);
  process.exit(1);
});
