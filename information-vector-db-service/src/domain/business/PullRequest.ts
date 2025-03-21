import { Metadata, Origin, Type } from "./metadata.js";

export class PullRequest{
    constructor(
        private id: number,
        private pull_number: number,
        private title: string,
        private description: string,
        private status: string,
        private assignees: string[],
        private reviewers: string[],
        private comments: string[],
        private modifiedFiles: string[],
        private fromBranch: string,
        private toBranch: string
    ) {}

    toStringifiedJson(): string {
        return JSON.stringify(this);
    }
    
    getMetadata(): Metadata {
        return new Metadata(Origin.GITHUB, Type.PULLREQUEST, this.id.toString());
    }
}