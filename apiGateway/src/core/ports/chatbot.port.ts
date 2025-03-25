import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { ProvChat } from '../domain/prov-chat';

export interface ChatBotPort {
  getRisposta(req: ReqAnswerCmd): Promise<ProvChat>;
}
