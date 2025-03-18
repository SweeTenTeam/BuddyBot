import { Workflow } from "src/domain/Workflow"

export interface GithubWorkflowsAPIPort{
    fetchGithubWorkflowInfo(): Promise<Workflow[]>
}