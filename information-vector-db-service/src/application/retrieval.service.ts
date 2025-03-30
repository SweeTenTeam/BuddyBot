import { Inject, Injectable } from '@nestjs/common';
import { RetrievalUseCase } from './port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../domain/command/retreive-cmd.js';
import { Information } from '../domain/business/information.js';
import { RETRIEVAL_PORT, RetrievalPort } from './port/out/retrieval-info.port.js';

@Injectable()
export class RetrievalService implements RetrievalUseCase {
  constructor(@Inject(RETRIEVAL_PORT) private readonly retrievalAdapter: RetrievalPort) {}
  async retrieveRelevantInfo(req: RetrieveCmd): Promise<Information[]> {
    const result = await this.retrievalAdapter.retrieveRelevantInfo(req);
    //console.log("Informazioni ritornate a chatbot: ")
    //console.log(result);
    return result;
  }
}