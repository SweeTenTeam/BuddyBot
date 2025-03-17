/*
import { Injectable, Inject } from '@nestjs/common';
import { ChatBotPort } from '../ports/chatbot.port';
import { StoricoPort } from '../ports/storico.port';
import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { ProvChat } from '../domain/prov-chat';

@Injectable()
export class GetRispostaUseCase {
  constructor(
    @Inject('ChatBotPort') private readonly chatbotPort: ChatBotPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort,
  ) {}

  async execute(req: ReqAnswerCmd): Promise<ProvChat> {
    const risposta = await this.chatbotPort.getRisposta(req);
    await this.storicoPort.postStorico(risposta); // SALVATAGGIO DELLA RISPOSTA
    return risposta;
  }
}
*/

//MOCK PER TEST SENZA FRONTEND

import { Injectable } from '@nestjs/common';
import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { ChatDTO } from '../domain/chat.dto';

@Injectable()
export class GetRispostaUseCase {
  async execute(req: ReqAnswerCmd): Promise<ChatDTO> {
    console.log('Ricevuto messaggio dal client:', req.text);

  
    return {
      id: 'mock-id-123',
      question: req.text,
      answer: 'Questa è una risposta mockata per test!',
      date: new Date(), 
    };
  }
}
