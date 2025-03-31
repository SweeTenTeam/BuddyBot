import { ReqAnswerCmd } from '../../../domain/cmds/req-answer-cmd';
import { Chat } from '../../../domain/business/chat';

export interface GetChatUseCase {
    execute(req: ReqAnswerCmd): Promise<Chat> ;
}