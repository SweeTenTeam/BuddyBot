import { Metadata, Origin, Type } from "./metadata.js";

export class Repository {
    constructor(
    private id: number,
    private name: string,
    private createdAt: string,
    private lastUpdate: string,
    private mainLanguage: string,
  ) {}

  toStringifiedJson(): string {
    return JSON.stringify(this);
  }
  
  getMetadata(): Metadata {
    return new Metadata(Origin.GITHUB, Type.REPOSITORY, this.id.toString());
  }
}
