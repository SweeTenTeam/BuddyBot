import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../core/ports/storico.port';
import { RequestChatCMD } from '../core/domain/request-chat-cmd';
import { Chat } from '../core/domain/chat';
import { ProvChat } from '../core/domain/prov-chat';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class StoricoMessageAdapter implements StoricoPort {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async getStorico(req: RequestChatCMD): Promise<Chat[]> {
    
    const chat: Chat = {
      id: req.id, 
      question: '', 
      answer: '',
      date: new Date(), 
    };
    return this.rabbitMQService.sendToQueue<Chat[]>('storico_queue', [chat]);
  }

  async postStorico(chat: ProvChat): Promise<void> {
    await this.rabbitMQService.sendToQueue('storico_save_queue', chat);
  }
}