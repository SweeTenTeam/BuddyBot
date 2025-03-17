/*
import { Injectable, Inject } from '@nestjs/common';
import { StoricoPort } from '../ports/storico.port';
import { RequestChatCMD } from '../domain/request-chat-cmd';
import { Chat } from '../domain/chat';

@Injectable()
export class GetStoricoUseCase {
  constructor(
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort
  ) {
    console.log('StoricoPort injected:', this.storicoPort); // LOGGER - Debug !!!
  }

  async execute(req: RequestChatCMD): Promise<Chat[]> {
    return this.storicoPort.getStorico(req);
  }
}
*/
// MOCK PER TEST SENZA FRONTEND

import { Injectable } from '@nestjs/common';
import { RequestChatCMD } from '../domain/request-chat-cmd';
import { ChatDTO } from '../domain/chat.dto';

@Injectable()
export class GetStoricoUseCase {
  async execute(req: RequestChatCMD): Promise<ChatDTO[]> {
    console.log('Ricevuta richiesta storico per ID:', req.id);

    
    return [
      {
        id: 'chat-1',
        question: 'Come stai?',
        answer: 'Sto bene, grazie!',
        date: new Date(), 
      },
      {
        id: 'chat-2',
        question: 'Che ore sono?',
        answer: 'Sono le 12:00.',
        date: new Date(), 
      },
    ];
  }
}
