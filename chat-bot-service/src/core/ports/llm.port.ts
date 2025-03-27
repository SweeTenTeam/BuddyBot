import { Chat } from '../../domain/entities/chat.entity';
import { ReqAnswerCmd } from '../../application/commands/request-answer.cmd';
import { Information } from 'src/domain/entities/information.entity';

export const LLM_PORT = 'LLM_PORT'; // Token simbolico

export interface LLMPort {
  generateAnswer(req: ReqAnswerCmd, info: Information[]): Promise<Chat>;
}