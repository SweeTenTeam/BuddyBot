import { ReqAnswerCmd } from '../../../domain/cmds/req-answer-cmd';
import { ProvChat } from '../../../domain/business/prov-chat';

export interface ChatBotPort {
  getRisposta(req: ReqAnswerCmd): Promise<ProvChat>;
}