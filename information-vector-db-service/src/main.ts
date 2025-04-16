import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module.js';
import { QdrantInformationRepository } from './adapter/out/persistance/qdrant-information-repository.js';
import { Metadata } from './domain/business/metadata.js';
import { Origin, Type } from './domain/shared/enums.js';

async function bootstrap() {
  console.log('Starting information-vector-db-service...');
  console.log('RabbitMQ URL:', process.env.RABBITMQ_URL || 'amqp://rabbitmq');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq'],
        queue: 'information-queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  
  const qdrantRepository = app.get<QdrantInformationRepository>(QdrantInformationRepository);

  await qdrantRepository.deleteByMetadata(new Metadata(Origin.CONFLUENCE, Type.DOCUMENT, '48005395'));
    await qdrantRepository.deleteByMetadata(new Metadata(Origin.CONFLUENCE, Type.DOCUMENT, '48005395'));


  // await qdrantRepository.deleteByMetadata(new Metadata(Origin.GITHUB, Type.FILE, '.DS_Store'));


  console.log('Microservice created, starting to listen...');
  await app.listen();
  console.log('Microservice is now listening for messages');
}

bootstrap().catch(error => {
  console.error('Failed to start microservice:', error);
  process.exit(1);
});


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

