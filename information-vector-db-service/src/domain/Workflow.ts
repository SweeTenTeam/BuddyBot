export class Workflow{
    constructor(
        private id: string,
        private status: string,
        private log: string,
        private trigger: string,
        private timeElapsed: string
    ) {}
}