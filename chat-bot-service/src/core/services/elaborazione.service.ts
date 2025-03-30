import { Injectable, Inject } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity.js';
import { ReqAnswerCmd } from '../../application/commands/request-answer.cmd.js';
import { LLMPort, LLM_PORT } from '../ports/llm.port.js';
import { VECTOR_DB_PORT, VectorDbPort } from '../ports/vector-db.port.js';
import { ElaborazioneUseCase } from '../../application/use-cases/elaborazione.use-case.js';

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
      console.log(`Retrieved ${relevantContext.length} relevant documents: `);
      //console.log(relevantContext);
      
      // 2. Genera la risposta utilizzando l'LLM con il contesto recuperato
      const chat = await this.llmPort.generateAnswer(req, relevantContext);
      
      return chat;
  }
}