import { Commit } from "./Commit.js";
import { Repository } from "./Repository.js";
import { File } from "./File.js"
import { PullRequest } from "./PullRequest.js";
import { Workflow } from "./Workflow.js";

export class GithubInfo{
    constructor(
        public commits: Commit[],
        public files: File[],
        public pullRequests: PullRequest[],
        public repo: Repository,
        public workflow: Workflow[]
    ) {}
}