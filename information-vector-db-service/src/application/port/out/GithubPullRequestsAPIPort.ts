import { PullRequest } from "src/domain/business/PullRequest.js"
import { GithubCmd } from "src/domain/command/GithubCmd.js"

export interface GithubPullRequestsAPIPort{
    fetchGithubPullRequestsInfo(req: GithubCmd): Promise<PullRequest[]>
}