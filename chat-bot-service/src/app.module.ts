import { Module } from '@nestjs/common';
import { ELABORAZIONE_USE_CASE, ElaborazioneUseCase } from './application/use-cases/elaborazione.use-case';
import { ElaborazioneService } from './core/services/elaborazione.service';
import { GroqAdapter } from './infrastructure/adapters/llm/groq.adapter';
import { LLM_PORT } from './core/ports/llm.port';
import { VECTOR_DB_PORT } from './core/ports/vector-db.port';
import { ConfigModule } from './infrastructure/config/config.module';
import { ChatController } from './infrastructure/chat-controller';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport} from '@nestjs/microservices';
import { VectorDbAdapter } from './infrastructure/adapters/message-broker/vector-db.adapter';
import { ChatGroq } from '@langchain/groq';


@Module({
  imports: [ConfigModule],
  controllers: [ChatController], 
  providers: [
    {
      provide: LLM_PORT,
      useClass: GroqAdapter,
    },
    {
      provide: VECTOR_DB_PORT,
      useClass: VectorDbAdapter,
    },
    {
      provide: ClientProxy,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq'],
            queue: 'information-queue',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
  },
  {
    provide: ChatGroq,
      useFactory: () => {
        return  new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "qwen-2.5-32b",
            maxTokens: 6000,
            maxRetries: 2,
        });
      },
  }
  ],
})
export class AppModule {}