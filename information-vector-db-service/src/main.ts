// import { NestFactory } from '@nestjs/core';
// import { Transport, MicroserviceOptions } from '@nestjs/microservices';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.RMQ,
//       options: {
//         urls: ['amqp://rabbitmq'],
//         queue: 'information_input',
//         queueOptions: {
//           durable: false,
//         },
//       },
//     },
//   );
//   await app.listen();
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';
import 'dotenv/config';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Connect to RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'information_service_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start all microservices (RabbitMQ)
  await app.startAllMicroservices();
  
  // Also start the HTTP server (optional, remove if you only need microservice)
  await app.listen(process.env.PORT || 3000);
  
  console.log(`Information Vector DB Service is running`);
  console.log(`- HTTP server on port ${process.env.PORT || 3000}`);
  console.log(`- Connected to RabbitMQ at ${process.env.RABBITMQ_URL || 'amqp://localhost:5672'}`);
}

bootstrap();

