import { Module } from '@nestjs/common';
import { ApiController } from './infrastructure/rest/api.controller';
import { GetStoricoUseCase } from './core/services/get-storico.use-case';
import { GetRispostaUseCase } from './core/services/get-risposta.use-case';
import { MessageAdapter } from './adapters/message.adapter';
import { StoricoMessageAdapter } from './adapters/storico-message.adapter';
import { ChatBotService } from '@infrastructure/rabbitmq/chatbot.service';
import { HistoryService } from '@infrastructure/rabbitmq/history.service';
import { InformationService } from '@infrastructure/rabbitmq/information.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    GetStoricoUseCase,
    GetRispostaUseCase,
    { provide: 'ChatBotPort', useClass: MessageAdapter },
    { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
    //RabbitMQService,
    ChatBotService,
    HistoryService,
    InformationService
  ],
})
export class AppModule {}