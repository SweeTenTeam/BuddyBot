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
}