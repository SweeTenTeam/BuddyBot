import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../core/ports/storico.port';
import { RequestChatCMD } from '../core/domain/request-chat-cmd';
import { Chat } from '../core/domain/chat';
import { HistoryService } from '@infrastructure/rabbitmq/history.service';

@Injectable()
export class StoricoMessageAdapter implements StoricoPort {
  constructor(private readonly historyService: HistoryService) {}

  /* */
  async getStorico(req: RequestChatCMD): Promise<Chat[]> {
    console.log(`Richiesta storico: ID=${req.id}, num=${req.numChat}`);

    
    const storico = await this.historyService.sendMessage('fetch_queue', req);
    
    console.log(`Storico ricevuto:`, storico);
    return storico;
  }

  /*  */
  async postStorico(chat: Chat): Promise<Chat> {
    console.log(`Salvataggio chat nello storico:`, chat);

    const chatSalvata = await this.historyService.sendMessage('chat_message', chat);

    // why this? {
    //  id: chat.id, // storico assegna l'ID nuovo, ora vuoto
    //  question: {
    //    content: chat.question.content,
    //    timestamp: chat.question.timestamp,
    //  },
    //  answer: {
    //    content: chat.answer.content,
    //    timestamp:'',// new Date().toISOString(), 
    //  },
    //}
    
    console.log(` Chat salvata nello storico:`, chatSalvata);
    return chatSalvata;
  }
}
