import { Repository } from "src/domain/business/Repository.js";
import { GithubCmd } from "src/domain/command/GithubCmd.js";

export const GITHUB_REPOSITORY_API_PORT = Symbol('GITHUB_REPOSITORY_API_PORT');

export interface GithubRepositoryAPIPort {
    fetchGithubRepositoryInfo(req: GithubCmd): Promise<Repository[]>
}