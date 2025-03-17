import { RequestChatDTO} from '../domain/request-chat.dto';
import { ProvChat } from '../domain/prov-chat';
import { ChatDTO } from '../domain/chat.dto';

export interface StoricoPort {
  getStorico(req: RequestChatDTO): Promise<ChatDTO[]>;
  postStorico(chat: ProvChat): Promise<void>;
}