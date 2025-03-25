import { Injectable, Inject } from '@nestjs/common';
import { ChatBotPort } from '../ports/chatbot.port';
import { StoricoPort } from '../ports/storico.port';
import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { ProvChat } from '../domain/prov-chat';
import { Chat } from '../domain/chat';
import { GetChatInterface } from '../interfaces/get-chat';

@Injectable()
export class GetRispostaUseCase implements GetChatInterface{
  constructor(
    @Inject('ChatBotPort') private readonly chatbotPort: ChatBotPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort, 
  ) {}

  async execute(req: ReqAnswerCmd): Promise<Chat> {
    console.log('📥 Ricevuta richiesta per risposta chatbot:', req);
  
    const provChat: ProvChat = await this.chatbotPort.getRisposta(req);
  
    console.log('✅ Risposta ottenuta dal chatbot:', provChat);
  
    const chat: Chat = {
      id: '',  // Lo storico genererà l'ID
      question: {
        content: provChat.question,   // ✅ Converte string in Message.content
        timestamp: provChat.timestamp, // ✅ Usa il timestamp della domanda
      },
      answer: {
        content: provChat.answer,     // ✅ Converte string in Message.content
        timestamp: new Date().toISOString(),  // ✅ Genera un timestamp valido per la risposta !!! DA TOGLIERE
      },
    };
    
    
  
    return this.storicoPort.postStorico(chat);
  }
  
  
  /* OLD
  async execute(req: ReqAnswerCmd): Promise<Chat> {
    const risposta = await this.chatbotPort.getRisposta(req);
  
    console.log('📥 Risposta ricevuta dal chatbot:', risposta);
  
    const prevChat: Chat = {
      id: '', // L'ID verrà generato dallo storico
      question: req.text, // Usa la domanda originale del frontend
      answer: risposta.answer, 
      date: risposta.date || new Date(),
    };
  
    console.log('📤 Inviando chat allo storico:', prevChat);
  
    // 3️⃣ Salva la chat nel microservizio storico e ottieni l'ID generato
    const savedChat = await this.storicoPort.postStorico(prevChat);
  
    console.log('✅ Chat salvata nello storico:', savedChat);
  
    return savedChat;
  }*/
  
}



/*
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
*/