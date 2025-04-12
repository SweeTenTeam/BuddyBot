import { MetadataDTO } from './metadata.dto.js';

export class InformationDTO {
  content: string;
  metadata: MetadataDTO;

  constructor(content: string, metadata: MetadataDTO) {
    this.content = content;
    this.metadata = metadata;
  }
}
