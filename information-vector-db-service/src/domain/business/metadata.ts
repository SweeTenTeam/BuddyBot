import { Origin, Type } from '../shared/enums.js';

export class Metadata {
  constructor(
    public readonly origin: Origin,
    public readonly type: Type,
    public readonly originID: string, 
  ) {}
}