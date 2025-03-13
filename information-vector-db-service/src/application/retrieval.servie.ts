import { Inject, Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort.js';
import { RetrievalUseCase } from './port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../domain/retreive-cmd.js';
import { Information } from '../domain/information.js';
import { Metadata, Origin, Type } from '../domain/metadata.js';
import { RETRIEVAL_PORT, RetrievalPort } from './port/out/retrieval-info.port.js';

@Injectable()
export class RetrievalService implements RetrievalUseCase {


  constructor(@Inject(RETRIEVAL_PORT) private readonly retrievalAdapter: RetrievalPort) {}


  async retrieveRelevantInfo(req: RetrieveCmd): Promise<Information[]> {
    // Mock return with some fake Information objects
    return Promise.resolve([
      new Information(
        'Mock content 1',
        new Metadata(Origin.CONFLUENCE, Type.COMMMIT, 'Mock attribute 1'),
      ),
      new Information(
        'Mock content 2',
        new Metadata(Origin.CONFLUENCE, Type.COMMMIT, 'Mock attribute 2'),
      ),
    ]);
  }

}