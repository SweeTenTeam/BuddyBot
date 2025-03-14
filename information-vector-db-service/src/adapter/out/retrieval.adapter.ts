import { Injectable } from '@nestjs/common';
import { Information } from '../../domain/information.js';
import { Metadata, Origin, Type } from '../../domain/metadata.js';
import { RETRIEVAL_PORT, RetrievalPort } from '../../application/port/out/retrieval-info.port.js';
import { RetrieveCmd } from '../../domain/retreive-cmd.js'
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';

@Injectable()
export class RetrieveAdapter implements RetrievalPort {
      constructor( private readonly informationRepository: QdrantInformationRepository) {}

  async retrieveRelevantInfo(req: RetrieveCmd): Promise<Information[]> {
    // Mock implementation returning some static Information objects
    return [
      new Information(
        "dsfa",
        new Metadata(Origin.GITHUB, Type.COMMMIT, "d")
      )
    ];
  }
}