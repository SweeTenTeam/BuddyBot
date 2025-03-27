import { Injectable, Inject } from '@nestjs/common';
import { StoricoPort } from '../ports/storico.port';
import { RequestChatCMD } from '../domain/request-chat-cmd';
import { Chat } from '../domain/chat';
import { GetStoricoInterface } from '../interfaces/get-storico';

@Injectable()
export class GetStoricoUseCase implements GetStoricoInterface {
  constructor(
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort
  ) {
    console.log('StoricoPort injected:', this.storicoPort); // LOGGER - Debug !!!
  }

  async execute(req: RequestChatCMD): Promise<Chat[]> {
    return this.storicoPort.getStorico(req);
  }
}