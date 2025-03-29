import { Metadata, Origin, Type } from "./metadata.js";

export class File{
    constructor(
        private path: string,
        private sha: string,
        private content: string
    ) {}

    toStringifiedJson(): string {
        return JSON.stringify(this);
    }

    getMetadata(): Metadata {
      return new Metadata(Origin.GITHUB, Type.FILE, this.sha);
    }
}