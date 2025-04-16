import { Metadata} from "./metadata.js";
import { Origin, Type } from "../shared/enums.js";


export class Repository {
    constructor(
    private id: number,
    private name: string,
    private createdAt: string,
    private lastUpdate: string,
    private mainLanguage: string,
  ) {}
    getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getLastUpdate(): string {
    return this.lastUpdate;
  }

  getMainLanguage(): string {
    return this.mainLanguage;
  }
  
  toStringifiedJson(): string {
    return JSON.stringify(this);
  }
  
  getMetadata(): Metadata {
    return new Metadata(Origin.GITHUB, Type.REPOSITORY, this.id.toString());
  }
}
