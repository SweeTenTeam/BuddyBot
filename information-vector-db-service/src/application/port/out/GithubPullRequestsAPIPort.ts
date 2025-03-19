import { PullRequest } from "src/domain/PullRequest.js"

export interface GithubPullRequestsAPIPort{
    fetchGithubPullRequestsInfo(): Promise<PullRequest[]>
}