import { WorkflowRun } from './WorkflowRun.js';

export class Workflow {
    constructor(
        private readonly id: number,
        private readonly name: string,
        private readonly state: string,
        private readonly runs: WorkflowRun[] = []
    ) {}

    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getState(): string {
        return this.state;
    }

    getRuns(): WorkflowRun[] {
        return this.runs;
    }

    addRun(run: WorkflowRun): void {
        this.runs.push(run);
    }
}