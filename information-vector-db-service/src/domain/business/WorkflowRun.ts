export class WorkflowRun {
  constructor(
    private readonly id: number,
    private readonly status: string,
    private readonly duration_seconds: number,
    private log: string,
    private trigger: string,
    private workflow_id: number,
    private workflow_name: string
  ) {}

  getId(): number {
    return this.id;
  }

  getStatus(): string {
    return this.status;
  }

  getDuration(): number {
    return this.duration_seconds;
  }

  getLog(): string {
    return this.log;
  }

  getTrigger(): string {
    return this.trigger;
  }

  getWorkflowId(): number {
    return this.workflow_id;
  }

  getWorkflowName(): string {
    return this.workflow_name;
  }
} 