export class WorkflowRun {
  constructor(
    private readonly id: number,
    private readonly status: string,
    private readonly duration: number,
    private log: string,
    private trigger: string,
  ) {}

  getId(): number {
    return this.id;
  }

  getStatus(): string {
    return this.status;
  }

  getDuration(): number {
    return this.duration;
  }

} 