export class Commit{
    constructor(
        private repoName: string,
        private ownerRepository: string,
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

    getRepoName(): string{
        return this.repoName;
    }
    getRepoOwner(): string{
        return this.ownerRepository;
    }

    getHash(): string {
        return this.hash;
    }

    getMessage(): string {
        return this.message;
    }

    getDateOfCommit(): string {
        return this.dateOfCommit;
    }

    getAuthor(): string {
        return this.author;
    }
}