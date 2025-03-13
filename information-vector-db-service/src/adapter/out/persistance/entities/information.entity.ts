import { MetadataEntity } from './metadata.entity.js';

export class InformationEntity {
  constructor(
    public readonly content: string,
    public readonly metadata: MetadataEntity,
  ) {}
}