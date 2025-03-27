export class File{
    constructor(
        private path: string,
        private sha: string,
        private content: string
    ) {}
}