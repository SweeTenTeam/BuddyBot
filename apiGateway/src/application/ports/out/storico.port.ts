import { RequestChatCMD} from '../../../domain/cmds/request-chat-cmd';
import { Chat } from '../../../domain/business/chat';
import { ProvChat } from '../../../domain/business/prov-chat';
import { LastUpdateCMD } from '../../../domain/cmds/LastUpdateCMD';

export interface StoricoPort {
  getStorico(req: RequestChatCMD): Promise<Chat[]>;
  postStorico(chat: ProvChat): Promise<Chat>; 
  postUpdate(LastFetch:LastUpdateCMD): Promise<Boolean>;
}
