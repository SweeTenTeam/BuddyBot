import { RepoGithubCMD } from "./RepoGithubCMD.js";

export class FetchGithubDto {
    constructor (
        public readonly repoDTOList: RepoGithubCMD[],
        public readonly lastUpdate?: Date
    ){}
}