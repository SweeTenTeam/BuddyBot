import { Repository } from "src/domain/Repository";

export interface GithubRepositoryAPIPort{
    fetchGithubRepositoryInfo(): Promise<Repository[]>
}