import { Module } from '@nestjs/common';
import { ELABORAZIONE_USE_CASE, ElaborazioneUseCase } from './application/use-cases/elaborazione.use-case.js';
import { ElaborazioneService } from './core/services/elaborazione.service.js';
import { GroqAdapter } from './infrastructure/adapters/llm/groq.adapter.js';
import { LLM_PORT } from './core/ports/llm.port.js';
import { VECTOR_DB_PORT } from './core/ports/vector-db.port.js';
import { ConfigModule } from './infrastructure/config/config.module.js';
import { ChatController } from './infrastructure/chat-controller.js';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport} from '@nestjs/microservices';
import { VectorDbAdapter } from './infrastructure/adapters/message-broker/vector-db.adapter.js';
import { ChatGroq } from '@langchain/groq';
import { VectorDbClient } from './vectordb.client.js';


@Module({
  imports: [ConfigModule],
  controllers: [ChatController], 
  providers: [
    VectorDbClient,
    {
      provide: LLM_PORT,
      useClass: GroqAdapter,
    },
    {
      provide: VECTOR_DB_PORT,
      useClass: VectorDbAdapter,
    },
    {
      provide: ELABORAZIONE_USE_CASE,
      useClass: ElaborazioneService
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
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            maxTokens: 6000,
            maxRetries: 2,

        });
      },
  }
  ],
})
export class AppModule {}