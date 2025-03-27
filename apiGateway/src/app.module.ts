import { Module } from '@nestjs/common';
import { ApiController } from './infrastructure/rest/api.controller';
import { GetStoricoUseCase } from './core/services/get-storico.use-case';
import { GetRispostaUseCase } from './core/services/get-risposta.use-case';
import { MessageAdapter } from './adapters/message.adapter';
import { StoricoMessageAdapter } from './adapters/storico-message.adapter';
import { RabbitMQModule } from './infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [ApiController],
  providers: [
    GetStoricoUseCase,
    GetRispostaUseCase,
    { provide: 'ChatBotPort', useClass: MessageAdapter },
    { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
    //RabbitMQService,
  ],
})
export class AppModule {}