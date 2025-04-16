import { RequestChatCMD } from '../../../domain/cmds/request-chat-cmd';
import { Chat } from '../../../domain/business/chat';

export interface GetStoricoUseCase {
    execute(req: RequestChatCMD): Promise<Chat[]> ;
}