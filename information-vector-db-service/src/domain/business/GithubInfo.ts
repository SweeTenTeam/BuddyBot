import { Commit } from "./Commit.js";
import { Repository } from "./Repository.js";
import { File } from "./File.js"
import { PullRequest } from "./PullRequest.js";
import { Workflow } from "./Workflow.js";
import { WorkflowRun } from "./WorkflowRun.js";

export class GithubInfo{
    constructor(
        public readonly commits: Commit[],
        public readonly files: File[],
        public readonly pullRequests: PullRequest[],
        public readonly repos: Repository[],
        public readonly workflows: Workflow[],
        public readonly workflow_runs: WorkflowRun[]
    ) {}
}