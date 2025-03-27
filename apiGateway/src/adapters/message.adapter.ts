import { Injectable } from '@nestjs/common';
import { ChatBotPort } from '../core/ports/chatbot.port';
import { ReqAnswerCmd } from '../core/domain/req-answer-cmd';
import { ProvChat } from '../core/domain/prov-chat';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class MessageAdapter implements ChatBotPort {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

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

    const response = await this.rabbitMQService.sendToQueue<ReqAnswerCmd, ProvChat>('chatbot_queue', request);

    if (!response || !response.answer) {
      console.error(" Errore: Risposta non valida da RabbitMQ", response);
      throw new Error("Risposta non valida dal chatbot");
    }

    console.log(` Risposta ricevuta dal chatbot:`, response);
    return response;
  }
}
