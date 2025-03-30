import { Injectable, Inject } from '@nestjs/common';
import { ChatBotPort } from '../ports/chatbot.port';
import { StoricoPort } from '../ports/storico.port';
import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { ProvChat } from '../domain/prov-chat';
import { Chat } from '../domain/chat';
import { GetChatInterface } from '../interfaces/get-chat';
import { Message } from '../domain/message';

@Injectable()
export class GetRispostaUseCase implements GetChatInterface{
  constructor(
    @Inject('ChatBotPort') private readonly chatbotPort: ChatBotPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort, 
  ) {}

  async execute(req: ReqAnswerCmd): Promise<Chat> {
    console.log('Ricevuta richiesta per risposta chatbot:', req);
  
    //return new Chat('',new Message(req.text,''),new Message(req.text,''))
    //returning early for show-off purposes
    const provChat: ProvChat = await this.chatbotPort.getRisposta(req);
  
    console.log('Risposta ottenuta dal chatbot:', provChat);
  
    //const chat: Chat = {
    //  id: '',  // Lo storico genererà l'ID
    //  question: {
    //    content: provChat.question,   
    //    timestamp: provChat.timestamp, 
    //  },
    //  answer: {
    //    content: provChat.answer,     
    //    timestamp: '',//new Date().toISOString(),  
    //  },
    //};
    // non serve
  
    return this.storicoPort.postStorico(new Chat('',new Message(provChat.question,provChat.timestamp),new Message(provChat.answer,''))); //RETUREN RISPOSTA CON TUTTI I DATI DA STORICO SERV
  }
  
}