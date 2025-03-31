import { Repository } from "src/domain/business/Repository.js";
import { GithubCmd } from "src/domain/command/GithubCmd.js";

export interface GithubRepositoryAPIPort{
    fetchGithubRepositoryInfo(req: GithubCmd): Promise<Repository[]>
}