import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  const rabbitmq = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'chat_queue',
      exchange: 'amq.topic', // o custom exchange
      routingKey: 'fetch_queue',
      queueOptions: {
        durable: false,
      }
    }
  })
  await rabbitmq.listen();
}
bootstrap();
