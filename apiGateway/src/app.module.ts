import { Module } from '@nestjs/common';
import { ApiController } from './adapters/in/api.controller';
import { GetStoricoService } from './application/services/storico-message.service';
import { GetRispostaService } from './application/services/chatbot-message.service';
import { MessageAdapter } from './adapters/out/message.adapter';
import { StoricoMessageAdapter } from './adapters/out/storico-message.adapter';
import { ChatBotService } from '@infrastructure/rabbitmq/chatbot.service';
import { HistoryService } from '@infrastructure/rabbitmq/history.service';
import { InformationService } from '@infrastructure/rabbitmq/information.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    GetStoricoService,
    GetRispostaService,
    { provide: 'ChatBotPort', useClass: MessageAdapter },
    { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
    //RabbitMQService,
    ChatBotService,
    HistoryService,
    InformationService
  ],
})
export class AppModule {}