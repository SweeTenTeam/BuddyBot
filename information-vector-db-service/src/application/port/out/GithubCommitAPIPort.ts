import { Commit } from "src/domain/Commit"

export interface GithubCommitsAPIPort{
    fetchGithubCommitsInfo(): Promise<Commit[]>
}