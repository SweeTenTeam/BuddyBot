import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;

  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: amqp.Connection) {}

  async onModuleInit() {
    await this.initialize();
  }

  /**/
  async initialize() {
    this.channel = await this.client.createChannel();

    await this.channel.assertQueue('chatbot_queue');
    await this.channel.assertQueue('storico_queue');
    await this.channel.assertQueue('storico_save_queue');

    console.log('RabbitMQService initialized and queues declared.');
  }

  /**/
  async sendToQueue<TRequest, TResponse>(queue: string, data: TRequest, timeoutMs = 5000): Promise<TResponse> {
    console.log(`Inviando messaggio a ${queue}:`, data);

    return new Promise<TResponse>(async (resolve, reject) => {
      try {
        
        const replyQueue = await this.channel.assertQueue('', { exclusive: true });

        const correlationId = Math.random().toString();
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
          correlationId,
          replyTo: replyQueue.queue,
        });

        console.log(`Messaggio inviato alla coda: ${queue}, in attesa di risposta...`);

        //
        const consumer = await this.channel.consume(
          replyQueue.queue,
          (message) => {
            if (!message) {
              reject(new Error(`Messaggio vuoto ricevuto da ${queue}`));
              return;
            }

            try {
              const content = JSON.parse(message.content.toString());
              this.channel.ack(message);
              resolve(content);
            } catch (err) {
              console.error(`Errore nel parsing JSON da ${queue}`);
              reject(new Error(`Errore parsing JSON`));
            }
          },
          { noAck: false }
        );

        console.log(` Consumatore registrato su ${replyQueue.queue}`);

        setTimeout(() => {
          this.channel.cancel(consumer.consumerTag).catch(() => {});
          reject(new Error(` Timeout su coda: ${queue}`));
        }, timeoutMs);
      } catch (err) {
        reject(err);
      }
    });
  }

  /* */
  async consumeQueue<T>(queue: string, callback: (msg: T) => void) {
    await this.channel.consume(queue, (message) => {
      if (message) {
        try {
          const content: T = JSON.parse(message.content.toString());
          this.channel.ack(message);
          callback(content);
        } catch (error) {
          console.error(`Errore nel parsing del messaggio da ${queue}`);
        }
      }
    });
  }

  /**/
  async closeConnection() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.client) {
      await this.client.close();
    }
    console.log('RabbitMQ connection closed.');
  }

  /**/
  onModuleDestroy() {
    this.closeConnection();
  }
}
