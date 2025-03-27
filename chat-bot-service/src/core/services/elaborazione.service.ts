import { Injectable, Inject } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity';
import { ReqAnswerCmd } from '../../application/commands/request-answer.cmd';
import { LLMPort, LLM_PORT } from '../ports/llm.port';
import { VECTOR_DB_PORT, VectorDbPort } from '../ports/vector-db.port';
import { VectorDbAdapter } from 'src/infrastructure/adapters/message-broker/vector-db.adapter';
import { ElaborazioneUseCase } from 'src/application/use-cases/elaborazione.use-case';

@Injectable()
export class ElaborazioneService implements ElaborazioneUseCase{
  constructor(
    @Inject(LLM_PORT)
    private readonly llmPort: LLMPort,
    @Inject(VECTOR_DB_PORT)
    private readonly vectorDbPort: VectorDbPort,
  ) {}

  async getAnswer(req: ReqAnswerCmd): Promise<Chat> {
      // 1. Ricerca del contesto rilevante nel database vettoriale tramite RabbitMQ
      const relevantContext = await this.vectorDbPort.searchVectorDb(req);
      console.log(`Retrieved ${relevantContext.length} relevant documents`);
      
      // 2. Genera la risposta utilizzando l'LLM con il contesto recuperato
      const chat = await this.llmPort.generateAnswer(req, relevantContext);
      
      return chat;
  }
}