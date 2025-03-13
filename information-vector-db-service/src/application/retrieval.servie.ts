import { Inject, Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort';
import { RetrievalUseCase } from './port/in/retrieval-usecase.port';
import { RetrieveCmd } from 'src/domain/retreive-cmd';
import { Information } from 'src/domain/information';
import { Metadata, Origin, Type } from 'src/domain/metadata';
import { RETRIEVAL_PORT, RetrievalPort } from './port/out/retrieval-info.port';

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