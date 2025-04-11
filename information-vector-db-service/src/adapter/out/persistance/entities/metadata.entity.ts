import { Origin, Type } from '../../../../domain/shared/enums.js'


export class MetadataEntity {
  constructor(
    public readonly origin: Origin,
    public readonly type: Type,
    public readonly originID: string, 
  ) {}
}