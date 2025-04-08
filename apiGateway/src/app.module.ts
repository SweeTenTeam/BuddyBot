import { Module } from '@nestjs/common';
import { ApiController } from './adapters/in/api.controller';
import { GetStoricoService } from './application/services/storico-message.service';
import { GetRispostaService } from './application/services/chatbot-message.service';
import { MessageAdapter } from './adapters/out/message.adapter';
import { StoricoMessageAdapter } from './adapters/out/storico-message.adapter';
import { ChatBotService } from './infrastructure/rabbitmq/chatbot.service';
import { HistoryService } from './infrastructure/rabbitmq/history.service';

import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './application/services/scheduler/scheduler.module';
import { InformationService } from './infrastructure/rabbitmq/information.service';
import { InformationAdapter } from './adapters/out/information.adapter';
//import { TasksService } from './application/services/scheduler/scheduler.service';


@Module({
  //imports: [],
  imports: [ScheduleModule.forRoot(), TasksModule],
  controllers: [ApiController],
  providers: [
    { provide: 'GetChatUseCase', useClass: GetRispostaService },
    { provide: 'GetStoricoUseCase', useClass: GetStoricoService },
    { provide: 'ChatBotPort', useClass: MessageAdapter },
    { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
    {provide: 'InfoPort', useClass: InformationAdapter },
    //{provide: 'TasksModule', useClass: TasksService},
    ChatBotService,
    HistoryService,
    InformationService
  ],
})
export class AppModule {}