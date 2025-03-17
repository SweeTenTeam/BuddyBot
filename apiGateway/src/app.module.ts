import { Module } from '@nestjs/common';
import { ApiController } from './infrastructure/rest/api.controller';
import { GetStoricoUseCase } from './core/use-cases/get-storico.use-case';
import { GetRispostaUseCase } from './core/use-cases/get-risposta.use-case';
import { MessageAdapter } from './adapters/message.adapter';
import { StoricoMessageAdapter } from './adapters/storico-message.adapter';
import { RabbitMQService } from './infrastructure/rabbitmq/rabbitmq.service';
//import { RabbitMQModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { RabbitMQModule } from '@infrastructure/rabbitmq/rabbitmq.module';

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