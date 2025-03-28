import { WorkflowRun } from './WorkflowRun.js';

export class Workflow {
    constructor(
        private  id: number,
        private  name: string,
        private  state: string,
        private repository_name: string,

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
    getRepositoryName(): string{
        return this.repository_name;
    }
}