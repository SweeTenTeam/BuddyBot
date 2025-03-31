import { RepoGithubDTO } from "./RepoGithubDTO.js";

export class FetchGithubDto {
    constructor (
        public readonly repoDTOList: RepoGithubDTO[],
        public readonly lastUpdate?: Date
    ){}
}