import { Commit } from "src/domain/Commit.js"

export interface GithubCommitsAPIPort{
    fetchGithubCommitsInfo(): Promise<Commit[]>
}