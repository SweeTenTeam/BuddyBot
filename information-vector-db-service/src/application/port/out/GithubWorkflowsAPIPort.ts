import { Workflow } from "../../../domain/business/Workflow.js"
import { WorkflowRun } from "../../../domain/business/WorkflowRun.js"
import { GithubCmd } from "../../../domain/command/GithubCmd.js"
import { WorkflowRunCmd } from "../../../domain/command/WorkflowRunCmd.js"


export interface GithubWorkflowsAPIPort{
    fetchGithubWorkflowInfo(req: GithubCmd): Promise<Workflow[]>
    fetchGithubWorkflowRuns(req: WorkflowRunCmd): Promise<WorkflowRun[]>
}