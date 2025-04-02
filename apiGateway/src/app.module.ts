import { Module } from '@nestjs/common';
import { ApiController } from './adapters/in/api.controller';
import { GetStoricoService } from './application/services/storico-message.service';
import { GetRispostaService } from './application/services/chatbot-message.service';
import { MessageAdapter } from './adapters/out/message.adapter';
import { StoricoMessageAdapter } from './adapters/out/storico-message.adapter';
import { ChatBotService } from './infrastructure/rabbitmq/chatbot.service';
import { HistoryService } from './infrastructure/rabbitmq/history.service';
import { InformationService } from './infrastructure/rabbitmq/information.service';
import { GetChatUseCase } from './application/ports/in/get-chat';
import { GetStoricoUseCase } from './application/ports/in/get-storico';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    { provide: 'GetChatUseCase', useClass: GetRispostaService },
    { provide: 'GetStoricoUseCase', useClass: GetStoricoService },
    { provide: 'ChatBotPort', useClass: MessageAdapter },
    { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
    ChatBotService,
    HistoryService,
    InformationService
  ],
})
export class AppModule {}