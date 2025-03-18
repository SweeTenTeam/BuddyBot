import { PullRequest } from "src/domain/PullRequest"

export interface GithubPullRequestsAPIPort{
    fetchGithubPullRequestsInfo(): Promise<PullRequest[]>
}