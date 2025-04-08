import { Injectable } from '@nestjs/common';
import { StoricoPort } from '../../application/ports/out/storico.port';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { HistoryService } from '../../infrastructure/rabbitmq/history.service';
//import { HistoryService } from '@infrastructure/rabbitmq/history.service';
import { ProvChat } from '../../domain/business/prov-chat';
import { LastUpdateCMD } from '../../domain/cmds/LastUpdateCMD';
import { Message } from 'src/domain/business/message';

@Injectable()
export class StoricoMessageAdapter implements StoricoPort {
  constructor(private readonly historyService: HistoryService) {}

  /* */
  async getStorico(req: RequestChatCMD): Promise<Chat[]> {
    console.log(`Richiesta storico: ID=${req.id}, num=${req.numChat}`);

    const storico = await this.historyService.sendMessage('fetch_queue', req);
    let result: Chat[]= [];
    for(let i=0; i<storico.length; i++){
      result.push(new Chat(storico[i].id, storico[i].question, storico[i].answer, storico[i].lastFetch));
    }
    console.log(`Storico ricevuto:`, storico);
    console.log(`result ricevuto:`, result);
    return result;
  }

  /* */
  async postStorico(chat: ProvChat): Promise<Chat> {
    console.log(`Salvataggio chat nello storico:`, chat);

    const chatSalvata = await this.historyService.sendMessage('chat_message', chat);
       console.log(` Chat salvata nello storico:`, chatSalvata);
    const resChat = new Chat(chatSalvata.id, new Message(chatSalvata.question.content,
       chatSalvata.question.timestamp), new Message(chatSalvata.answer.content, chatSalvata.answer.timestamp), chatSalvata.lastFetch);
 
    console.log(resChat);
    return resChat;
  }

  /** */
  async postUpdate(LastFetch: LastUpdateCMD): Promise<Boolean> {
    console.log(`Salvataggio data fetch nello storico:`, LastFetch);

    const result = await this.historyService.sendMessage('lastFetch_queue', LastFetch);

    console.log(` Data fetch salvata nello storico:`, result);
    return result;
  }
}
