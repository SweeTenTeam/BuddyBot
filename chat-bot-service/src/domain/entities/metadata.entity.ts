export class Metadata {
  

   constructor(
    public readonly origin: string,
    public readonly type: string,
    public readonly originID: string,
   ) 
   {}

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



