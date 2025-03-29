import { Metadata, Origin, Type } from "./metadata.js";

export class Workflow{
    constructor(
        private id: number,
        private name: string,
        private status: string,
        private log: string,
        private trigger: string,
        private timeElapsed: string
    ) {}

    toStringifiedJson(): string {
        return JSON.stringify(this);
    }

    getMetadata(): Metadata {
        return new Metadata(Origin.GITHUB, Type.WORKFLOW, this.id.toString());
    }
}