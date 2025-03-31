export class WorkflowRunCmd{
    workflow_id: number;
    workflow_name: string;

    owner: string;
    repository: string;
    
    since_created?: Date; // Optional date for filtering workflow runs by creation date
}