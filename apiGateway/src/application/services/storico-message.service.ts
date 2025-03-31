import { Injectable, Inject } from '@nestjs/common';
import { StoricoPort } from '../ports/out/storico.port';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { GetStoricoUseCase } from '../ports/in/get-storico';

@Injectable()
export class GetStoricoService implements GetStoricoUseCase {
  constructor(
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort
  ) {
    console.log('StoricoPort injected:', this.storicoPort); 
  }

  async execute(req: RequestChatCMD): Promise<Chat[]> {
    return this.storicoPort.getStorico(req);
  }
}