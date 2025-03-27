import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../core/ports/storico.port';
import { RequestChatCMD } from '../core/domain/request-chat-cmd';
import { Chat } from '../core/domain/chat';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class StoricoMessageAdapter implements StoricoPort {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  /* */
  async getStorico(req: RequestChatCMD): Promise<Chat[]> {
    console.log(`Richiesta storico: ID=${req.id}, num=${req.numChat}`);

    
    const storico = await this.rabbitMQService.sendToQueue<RequestChatCMD, Chat[]>('storico_queue', req);
    
    console.log(` Storico ricevuto:`, storico);
    return storico;
  }

  /*  */
  async postStorico(chat: Chat): Promise<Chat> {
    console.log(`Salvataggio chat nello storico:`, chat);

    const chatSalvata = await this.rabbitMQService.sendToQueue<Chat, Chat>('storico_save_queue', {
      id: chat.id, // storico assegna l'ID nuovo, ora vuoto
      question: {
        content: chat.question.content,
        timestamp: chat.question.timestamp,
      },
      answer: {
        content: chat.answer.content,
        timestamp:'',// new Date().toISOString(), 
      },
    });

    console.log(` Chat salvata nello storico:`, chatSalvata);
    return chatSalvata;
  }
}
