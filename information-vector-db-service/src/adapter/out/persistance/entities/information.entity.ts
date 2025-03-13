import { MetadataEntity } from './metadata.entity';

export class InformationEntity {
  constructor(
    public readonly content: string,
    public readonly metadata: MetadataEntity,
  ) {}
}