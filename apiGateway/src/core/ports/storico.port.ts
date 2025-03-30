import { RequestChatCMD} from '../domain/request-chat-cmd';
import { Chat } from '../domain/chat';

export interface StoricoPort {
  getStorico(req: RequestChatCMD): Promise<Chat[]>;
  postStorico(chat: Chat): Promise<Chat>; 
}
