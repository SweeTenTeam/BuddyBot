export class File{
    constructor(
        private path: string,
        private sha: string,
        private repositoryName: string,
        private branchName: string,
        private content: string
    ) {}
}