import { Injectable } from '@nestjs/common';
import { ChatBotPort } from '../../application/ports/out/chatbot.port';
import { ReqAnswerCmd } from '../../domain/cmds/req-answer-cmd';
import { ProvChat } from '../../domain/business/prov-chat';
import { ChatBotService } from '../../infrastructure/rabbitmq/chatbot.service';

@Injectable()
export class MessageAdapter implements ChatBotPort {
  constructor(private readonly chatbotService: ChatBotService) {}

  /* */
  async getRisposta(req: ReqAnswerCmd): Promise<ProvChat> {

    console.log(`Richiesta inviata al chatbot:`, req);

    const response = await this.chatbotService.sendMessage('get-answer', req); // no chatbotqueue ma messagepattern
   
    console.log(`Risposta ricevuta dal chatbot:`, response);

    return response;
  }
}
