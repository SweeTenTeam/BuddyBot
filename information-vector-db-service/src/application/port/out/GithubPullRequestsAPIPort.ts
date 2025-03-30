import { PullRequest } from "src/domain/business/PullRequest.js"

export interface GithubPullRequestsAPIPort{
    fetchGithubPullRequestsInfo(): Promise<PullRequest[]>
}