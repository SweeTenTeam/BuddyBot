import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://rabbitmq'],
    queue: 'history-queue',
    queueOptions: {
      durable: true,
    },
  },
});