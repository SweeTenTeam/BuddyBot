import { PullRequest } from "src/domain/business/PullRequest.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export const GITHUB_PULL_REQUESTS_API_PORT = Symbol('GITHUB_PULL_REQUESTS_API_PORT');

export interface GithubPullRequestsAPIPort {
    fetchGithubPullRequestsInfo(req: GithubCmd): Promise<PullRequest[]>
}