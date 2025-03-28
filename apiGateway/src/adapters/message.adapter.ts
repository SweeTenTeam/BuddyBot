import { Injectable } from '@nestjs/common';
import { ChatBotPort } from '../core/ports/chatbot.port';
import { ReqAnswerCmd } from '../core/domain/req-answer-cmd';
import { ProvChat } from '../core/domain/prov-chat';
import { ChatBotService } from '@infrastructure/rabbitmq/chatbot.service';

@Injectable()
export class MessageAdapter implements ChatBotPort {
  constructor(private readonly chatbotService: ChatBotService) {}

  /* */
  async getRisposta(req: ReqAnswerCmd): Promise<ProvChat> {
    if (!req.text) {
      throw new Error("Il testo della domanda non può essere vuoto");
    }

    const request: ReqAnswerCmd = {
      text: req.text,
      date: req.date || new Date().toISOString(),
    };

    console.log(`Richiesta inviata al chatbot:`, request);

    const response = await this.chatbotService.sendMessage('chatbot_queue', request); // no chatbotqueue ma messagepattern

    if (!response || !response.answer) {
      console.error(" Errore: Risposta non valida da RabbitMQ", response);
      throw new Error("Risposta non valida dal chatbot");
    }

    console.log(` Risposta ricevuta dal chatbot:`, response);
    return response;
  }
}
