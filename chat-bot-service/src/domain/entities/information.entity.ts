import { Metadata } from "./metadata.entity.js";

export class Information {
  constructor(
    public readonly content: string,
    public readonly metadata: Metadata,
  ){}

  getContent(): string {
    return this.content;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }
}