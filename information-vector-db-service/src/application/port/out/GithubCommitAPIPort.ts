import { Commit } from "src/domain/business/Commit.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export interface GithubCommitsAPIPort{
    fetchGithubCommitsInfo(req: GithubCmd): Promise<Commit[]>
}