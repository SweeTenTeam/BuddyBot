import { Injectable, Inject } from '@nestjs/common';
import { ChatBotPort } from '../ports/out/chatbot.port';
import { StoricoPort } from '../ports/out/storico.port';
import { ReqAnswerCmd } from '../../domain/cmds/req-answer-cmd';
import { ProvChat } from '../../domain/business/prov-chat';
import { Chat } from '../../domain/business/chat';
import { GetChatUseCase } from '../ports/in/get-chat';

@Injectable()
export class GetRispostaService implements GetChatUseCase{
  constructor(
    @Inject('ChatBotPort') private readonly chatbotPort: ChatBotPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort, 
  ) {}

  async execute(req: ReqAnswerCmd): Promise<Chat> {
    console.log('Ricevuta richiesta per risposta chatbot:', req);
  
    const provChat: ProvChat = await this.chatbotPort.getRisposta(req);
  
    console.log('Risposta ottenuta dal chatbot:', provChat);
  
    //return this.storicoPort.postStorico(provChat);//RETUREN RISPOSTA CON TUTTI I DATI DA STORICO SERV
    return this.storicoPort.postStorico(new ProvChat(provChat.question, provChat.answer, provChat.timestamp || req.date)); // xKE CHATBOT non ritorna date
  }
  
}