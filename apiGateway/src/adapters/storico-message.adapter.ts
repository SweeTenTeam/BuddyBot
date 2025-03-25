import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../core/ports/storico.port';
import { RequestChatCMD } from '../core/domain/request-chat-cmd';
import { Chat } from '../core/domain/chat';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class StoricoMessageAdapter implements StoricoPort {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async getStorico(req: RequestChatCMD): Promise<Chat[]> {
    
    const chat: Chat = {
      id: req.id, 
      question: {
        content: 'Domanda di esempio',
        timestamp: new Date().toISOString(),
      }, 
      answer: {
        content: 'Risposta di esempio',
        timestamp: new Date().toISOString(),
      },
    };
    
    return this.rabbitMQService.sendToQueue<Chat[]>('storico_queue', [chat]);
  }


  async postStorico(chat: Chat): Promise<Chat> {
    return this.rabbitMQService.sendToQueue<Chat>('storico_save_queue', {
      id: ' ',//'generated-id-' + new Date().getTime(), // X TESTS
      question: {
        content: chat.question.content,
        timestamp: chat.question.timestamp,
      },
      answer: {
        content: chat.answer.content,
        timestamp: new Date().toISOString(), // Il microservizio storico genera la data della risposta
      },
    });
  }
 
}