import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: amqp.Connection
  ) {}

  // Metodo automatico all'avvio del modulo
  async onModuleInit() {
    await this.initialize();
  }

  // Inizializzazione del canale e delle code
  private async initialize() {
    this.channel = await this.client.createChannel();

    // Dichiarazione delle code
    await this.channel.assertQueue('chatbot_queue');
    await this.channel.assertQueue('storico_queue');
    await this.channel.assertQueue('storico_save_queue');

    console.log('✅ RabbitMQService initialized and queues declared.');
  }

  // Metodo per inviare dati a una coda e ricevere una risposta
  async sendToQueue<T>(queue: string, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        // Invia il messaggio
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        console.log(`📨 Messaggio inviato alla coda: ${queue}`);

        // Ricezione della risposta (da migliorare lato consumer reale)
        this.channel.consume(
          queue,
          (message) => {
            if (message) {
              const content = JSON.parse(message.content.toString());
              this.channel.ack(message); // Conferma ricezione
              console.log(`✅ Risposta ricevuta dalla coda: ${queue}`);
              resolve(content);
            }
          },
          { noAck: false } // ACK manuale
        );
      } catch (err) {
        console.error('❌ Errore durante l\'invio alla coda:', err);
        reject(err);
      }
    });
  }
}
