export class Workflow{
    constructor(
        private id: number,
        private name: string,
        private status: string,
        private log: string,
        private trigger: string,
        private timeElapsed: string
    ) {}
}