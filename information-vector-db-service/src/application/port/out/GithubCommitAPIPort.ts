import { Commit } from "src/domain/business/Commit.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export const GITHUB_COMMITS_API_PORT = Symbol('GITHUB_COMMITS_API_PORT');

export interface GithubCommitsAPIPort {
    fetchGithubCommitsInfo(req: GithubCmd): Promise<Commit[]>
}