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
    const entities = await this.informationRepository.retrieveRelevantInfo(req.query);
    
    return entities.map(entity => new Information(
      entity.content,
      new Metadata(
        entity.metadata.origin as unknown as Origin,
        entity.metadata.type as unknown as Type,
        entity.metadata.originID
      )
    ));
  }
}