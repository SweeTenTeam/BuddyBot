import { Injectable } from '@nestjs/common';
import { ChatBotPort } from '../core/ports/chatbot.port';
import { ReqAnswerCmd } from '../core/domain/req-answer-cmd';
import { ProvChat } from '../core/domain/prov-chat';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class MessageAdapter implements ChatBotPort {
  constructor(private readonly rabbitMQService: RabbitMQService) {}
  
  async getRisposta(req: ReqAnswerCmd): Promise<ProvChat> {
    const provChat: ProvChat = {
      question: req.text,
      answer: '', 
      timestamp: req.date || new Date().toISOString(), 
    };
    
    return this.rabbitMQService.sendToQueue<ProvChat>('chatbot_queue', provChat);
  }
}
