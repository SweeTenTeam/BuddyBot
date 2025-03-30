import { RequestChatCMD } from '../domain/request-chat-cmd';
import { Chat } from '../domain/chat';

export interface GetStoricoInterface {
    execute(req: RequestChatCMD): Promise<Chat[]> ;
}