import { Metadata } from "./metadata.entity.js";

export class Information {
  private content: string;
  private metadata: Metadata;

  constructor(content: string, metadata: Metadata){
    this.content = content;
    this.metadata = metadata;
  }

  getContent(): string {
    return this.content;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }
}