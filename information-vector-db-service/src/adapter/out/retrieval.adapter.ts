import { Injectable } from '@nestjs/common';
import { Information } from '../../domain/information';
import { Metadata, Origin, Type } from '../../domain/metadata';
import { RETRIEVAL_PORT, RetrievalPort } from 'src/application/port/out/retrieval-info.port';
import { RetrieveCmd } from 'src/domain/retreive-cmd';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository';

@Injectable()
export class RetrieveAdapter implements RetrievalPort {
      constructor( private readonly informationRepository: QdrantInformationRepository) {}

  retrieveRelevantInfo(req: RetrieveCmd): Information[] {
    // Mock implementation returning some static Information objects
    return [
      new Information(
        "dsfa",
        new Metadata(Origin.GITHUB, Type.COMMMIT, "d")
      )
    ];
  }
}