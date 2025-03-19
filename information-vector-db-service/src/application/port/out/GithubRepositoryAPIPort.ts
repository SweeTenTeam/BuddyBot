import { Repository } from "src/domain/Repository.js";

export interface GithubRepositoryAPIPort{
    fetchGithubRepositoryInfo(): Promise<Repository[]>
}