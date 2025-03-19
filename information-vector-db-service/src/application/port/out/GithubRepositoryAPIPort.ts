import { Repository } from "src/domain/business/Repository.js";

export interface GithubRepositoryAPIPort{
    fetchGithubRepositoryInfo(): Promise<Repository[]>
}