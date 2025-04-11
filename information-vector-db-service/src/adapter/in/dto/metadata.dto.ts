import { Origin, Type } from '../../../domain/shared/enums.js';

export class MetadataDTO {
  origin: Origin;
  type: Type;
  originID: string;

  constructor(origin: Origin, type: Type, originID: string) {
    this.origin = origin;
    this.type = type;
    this.originID = originID;
  }
} 