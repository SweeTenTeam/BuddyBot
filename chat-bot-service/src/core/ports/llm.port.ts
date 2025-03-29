import { Chat } from '../../domain/entities/chat.entity.js';
import { ReqAnswerCmd } from '../../application/commands/request-answer.cmd.js';
import { Information } from '../../domain/entities/information.entity.js';

export const LLM_PORT = 'LLM_PORT'; // Token simbolico

export interface LLMPort {
  generateAnswer(req: ReqAnswerCmd, info: Information[]): Promise<Chat>;
}