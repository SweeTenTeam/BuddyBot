import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;

  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: amqp.Connection) {}

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() { // !!!
    this.channel = await this.client.createChannel();

    await this.channel.assertQueue('chatbot_queue');
    await this.channel.assertQueue('storico_queue');
    await this.channel.assertQueue('storico_save_queue');

    console.log('✅ RabbitMQService initialized and queues declared.');
  }
  // !!! 
  async sendToQueue<T>(queue: string, data: T, timeoutMs = 5000): Promise<T> {
    console.log(`📨 Inviando messaggio a ${queue}:`, data);
  
    return new Promise<T>(async (resolve, reject) => {
      try {
        // 🔥 Creiamo una coda di risposta esclusiva per il test
        const replyQueue = await this.channel.assertQueue('', { exclusive: true });
  
        const correlationId = Math.random().toString();
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
          correlationId,
          replyTo: replyQueue.queue, // ✅ Aspettiamo la risposta su questa coda
        });
  
        console.log(`📨 Messaggio inviato alla coda: ${queue}`);
  // !!!
        this.channel.consume(
          queue,
          (message) => {
            console.log(`📥 REAL: Ricevuto messaggio su ${queue}:`, message?.content?.toString());
            if (!message) {
              reject(new Error(`Messaggio vuoto ricevuto da ${queue}`));
              return;
            }
        
            const rawContent = message.content.toString();
            console.log(`📥 REAL: Contenuto ricevuto:`, rawContent);
        
            try {
              const content = JSON.parse(rawContent);
              this.channel.ack(message);
              resolve(content);
            } catch (err) {
              console.error(`❌ Errore parsing JSON`);
              reject(new Error(`Errore parsing JSON`));
            }
          },
          { noAck: false }
        );
        console.log(`✅ Channel.consume è stato registrato per ${queue}`);
      
  
        setTimeout(() => reject(new Error(`⏳ Timeout su coda: ${queue}`)), timeoutMs);
      } catch (err) {
        reject(err);
      }
    });
  }
  // !!!
  async consumeQueue(queue: string, callback: (msg: any) => void) {
    await this.channel.consume(queue, (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        this.channel.ack(message);
        callback(content);
      }
    });
  }

  async closeConnection() { // !!!
    if (this.channel) {
      await this.channel.close();
    }
    if (this.client) {
      await this.client.close();
    }
    console.log('🚪 RabbitMQ connection closed.');
  }

  onModuleDestroy() {
    this.closeConnection();
  }
}
