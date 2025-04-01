import { Metadata, Origin, Type } from "./metadata.js";
import { CommentPR } from "./CommentPR.js";
export class PullRequest{
    constructor(
        private id: number,
        private pull_number: number,
        private title: string,
        private description: string,
        private status: string,
        private assignees: string[],
        private reviewers: string[],
        private comments: CommentPR[],
        private modifiedFiles: string[],
        private fromBranch: string,
        private toBranch: string,
        private repository_name: string,
    ) {}


    getComments():CommentPR[]{
        return this.comments;
    }

    getId(): number {
        return this.id;
    }

    getPullNumber(): number {
        return this.pull_number;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getStatus(): string {
        return this.status;
    }

    getAssignees(): string[] {
        return this.assignees;
    }

    getReviewers(): string[] {
        return this.reviewers;
    }

    getModifiedFiles(): string[] {
        return this.modifiedFiles;
    }

    getFromBranch(): string {
        return this.fromBranch;
    }

    getToBranch(): string {
        return this.toBranch;
    }

    getRepositoryName(): string {
        return this.repository_name;
    }

    toStringifiedJson(): string {
        return JSON.stringify(this);
    }

    getMetadata(): Metadata {
      return new Metadata(Origin.GITHUB, Type.PULLREQUEST, this.id.toString());
    }
}