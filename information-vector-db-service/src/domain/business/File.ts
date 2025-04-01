import { Metadata, Origin, Type } from "./metadata.js";

export class File{
    constructor(
        private path: string,
        private sha: string,
        private repositoryName: string,
        private branchName: string,
        private content: string
    ) {}

    getPath(): string {
        return this.path;
    }

    getSha(): string {
        return this.sha;
    }

    getRepositoryName(): string {
        return this.repositoryName;
    }

    getBranchName(): string {
        return this.branchName;
    }

    getContent(): string {
        return this.content;
    }
        toStringifiedJson(): string {
        return JSON.stringify(this);
    }

    getMetadata(): Metadata {
      return new Metadata(Origin.GITHUB, Type.FILE, this.sha);
    }
}