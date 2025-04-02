import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../../application/ports/out/storico.port';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { HistoryService } from '../../infrastructure/rabbitmq/history.service';
//import { HistoryService } from '@infrastructure/rabbitmq/history.service';
import { ProvChat } from '../../domain/business/prov-chat';

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

  /* */
  async postStorico(chat: ProvChat): Promise<Chat> {
    console.log(`Salvataggio chat nello storico:`, chat);

    const chatSalvata = await this.historyService.sendMessage('chat_message', chat);

    console.log(` Chat salvata nello storico:`, chatSalvata);
    return chatSalvata;
  }
}
