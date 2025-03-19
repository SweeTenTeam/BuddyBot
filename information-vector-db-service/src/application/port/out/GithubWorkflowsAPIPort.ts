import { Workflow } from "src/domain/Workflow.js"

export interface GithubWorkflowsAPIPort{
    fetchGithubWorkflowInfo(): Promise<Workflow[]>
}