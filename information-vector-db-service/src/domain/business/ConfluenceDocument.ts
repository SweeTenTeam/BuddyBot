import { Metadata} from "./metadata.js";
import { Origin, Type } from "../shared/enums.js";


export class ConfluenceDocument {
  constructor(
    private id: string,
    private title: string,
    private status: string,//name
    private author: string,//name
    private owner: string,
    private space: number,
    private content: string,
  ) {}

  // Getter methods
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getStatus(): string {
    return this.status;
  }

  getAuthor(): string {
    return this.author;
  }

  getOwner(): string {
    return this.owner;
  }

  getContent(): string {
    return this.content;
  }

  getSpace(): number {
    return this.space;
  }

  toStringifiedJson(): string {
    return JSON.stringify(this);
  }

  getMetadata(): Metadata {
    return new Metadata(Origin.CONFLUENCE, Type.DOCUMENT, this.id.toString());
  }
}
