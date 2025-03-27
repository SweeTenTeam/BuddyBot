import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { Chat } from '../domain/chat';

export interface GetChatInterface {
    execute(req: ReqAnswerCmd): Promise<Chat> ;
}