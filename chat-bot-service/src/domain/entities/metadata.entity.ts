export class Metadata {
  origin: string;
  type: string;
  originID: string;

   constructor(origin: string, type: string, originID: string) {
    this.origin = origin;
    this.type = type;
    this.originID = originID;
  }

  getOrigin(): string{
    return this.origin;
  }

  getType(): string{
    return this.type;
  }

  getOriginID(): string{
    return this.originID;
  }
}



