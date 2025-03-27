export class Commit{
    constructor(
        private repoName: string,
        private branch: string,
        private hash: string,
        private message: string,
        private dateOfCommit: string,
        private modifiedFiles: string[],
        private author: string,
    ) {}

    getModifiedFiles(): string[] {
        return this.modifiedFiles;
    }

    getBranch():string{
        return this.branch;
    }
}