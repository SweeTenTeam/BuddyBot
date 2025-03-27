import { Inject, Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort.js';
import { RetrievalUseCase } from './port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../domain/command/retreive-cmd.js';
import { Information } from '../domain/business/information.js';
import { RETRIEVAL_PORT, RetrievalPort } from './port/out/retrieval-info.port.js';

@Injectable()
export class RetrievalService implements RetrievalUseCase {


  constructor(@Inject(RETRIEVAL_PORT) private readonly retrievalAdapter: RetrievalPort) {}


  async retrieveRelevantInfo(req: RetrieveCmd): Promise<Information[]> {
    return await this.retrievalAdapter.retrieveRelevantInfo(req);
    
  
  }

}