import { RequestChatCMD} from '../../../domain/cmds/request-chat-cmd';
import { Chat } from '../../../domain/business/chat';
import { ProvChat } from '../../../domain/business/prov-chat';

export interface StoricoPort {
  getStorico(req: RequestChatCMD): Promise<Chat[]>;
  postStorico(chat: ProvChat): Promise<Chat>; 
  postUpdate(LastFetch:string): Promise<Boolean>;
}
