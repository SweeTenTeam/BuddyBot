export class WorkflowRunCmd{
    workflow_id: number;
    workflow_name: string;

    owner: string;
    repository: string;
    
    since_created?: Date; 
}