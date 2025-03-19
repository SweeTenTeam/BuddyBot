import { Workflow } from "src/domain/business/Workflow.js"

export interface GithubWorkflowsAPIPort{
    fetchGithubWorkflowInfo(): Promise<Workflow[]>
}