export class Commit{
    constructor(
        private id: string,
        private message: string,
        private hash: string,
        private dateTime: Date,
        private relatedBranch: string,
        private modifiedFiles: string[],
        private author: string,
    ) {}
}