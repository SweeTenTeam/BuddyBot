import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://rabbitmq'], // Replace with your RabbitMQ server URL
    queue: 'information-queue', // Define the queue name
    queueOptions: {
      durable: true,
    },
  },
});