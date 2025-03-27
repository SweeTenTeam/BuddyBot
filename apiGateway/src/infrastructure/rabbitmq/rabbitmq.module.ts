import { Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';

//PER DOCKER
@Module({
  providers: [
    {
      provide: 'RABBITMQ_CLIENT',
      useFactory: async () => {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        return connection;
      },
    },
    RabbitMQService,
  ],
  exports: ['RABBITMQ_CLIENT', RabbitMQService],
})
export class RabbitMQModule {}

/*
//SENZA DOCKER
@Module({
  providers: [
    RabbitMQService,
    {
      provide: 'RABBITMQ_CLIENT',
      useFactory: async () => {
        console.log('Connecting to RabbitMQ...');
        const connection = await amqp.connect('amqp://localhost');
        console.log('RabbitMQ connected successfully.');
        return connection;
      },
    },
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
*/