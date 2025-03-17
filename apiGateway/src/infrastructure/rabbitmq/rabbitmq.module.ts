import { Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';

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