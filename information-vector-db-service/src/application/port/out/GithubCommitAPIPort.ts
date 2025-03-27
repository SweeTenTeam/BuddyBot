import { Commit } from "src/domain/business/Commit.js"

export interface GithubCommitsAPIPort{
    fetchGithubCommitsInfo(): Promise<Commit[]>
}