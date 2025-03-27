import { Workflow } from "src/domain/business/Workflow.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export interface GithubWorkflowsAPIPort{
    fetchGithubWorkflowInfo(req: GithubCmd): Promise<Workflow[]>
}