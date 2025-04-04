import { RepoGithubCMD } from "./RepoGithubCMD.js";

export class FetchGithubCMD {
    constructor (
        public readonly repoDTOList: RepoGithubCMD[],
        public readonly lastUpdate: Date
    ){}
}