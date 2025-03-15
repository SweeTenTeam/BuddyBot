import { GithubCommitsAPIPort } from "src/application/port/out/GithubCommitAPIPort";
import { GithubFilesAPIPort } from "src/application/port/out/GithubFilesAPIPort";
import { GithubPullRequestsAPIPort } from "src/application/port/out/GithubPullRequestsAPIPort";
import { GithubRepositoryAPIPort } from "src/application/port/out/GithubRepositoryAPIPort";
import { GithubWorkflowsAPIPort } from "src/application/port/out/GithubWorkflowsAPIPort";
import { GithubAPIFacade } from "./GithubAPIFacade";
import { Injectable } from '@nestjs/common';
import { Commit } from "src/domain/Commit";
import { File } from "src/domain/File";
import { PullRequest } from "src/domain/PullRequest";
import { Repository } from "src/domain/Repository";
import { Workflow } from "src/domain/Workflow";

@Injectable()
export class GithubAPIAdapter implements GithubCommitsAPIPort, GithubFilesAPIPort, GithubPullRequestsAPIPort, GithubRepositoryAPIPort, GithubWorkflowsAPIPort{
  private readonly githubAPI: GithubAPIFacade;
  constructor(githubAPI: GithubAPIFacade) {
    this.githubAPI = githubAPI;
  }
  fetchGithubCommitsInfo(): Promise<Commit[]> {
    return Commit[1];
  }

  fetchGithubFilesInfo(): Promise<File[]> {
    return File[1];
  }

  async fetchGithubPullRequestsInfo(): Promise<PullRequest[]> {
    const pullRequestsInfo = await this.githubAPI.fetchPullRequestsInfo();
    const result: PullRequest[] = [];
    for(const pullRequest of pullRequestsInfo.data){
        const assignees: string[] = [];
        for(const assignee of pullRequest.assignees || []){
            assignees.push(assignee.login);
        }
        const requested_reviewers: string[] = [];
        for(const reviewer of pullRequest.requested_reviewers || []){
            requested_reviewers.push(reviewer.login);
        }
        const filenames = await this.githubAPI.fetchPullRequestModifiedFiles(pullRequest.number);
        result.push(new PullRequest(
            pullRequest.id,
            pullRequest.number,
            pullRequest.title,
            pullRequest.body || '',
            pullRequest.state,
            assignees,
            requested_reviewers,
            [], //to fix comments
            filenames,
            pullRequest.head.ref,
            pullRequest.base.ref
        ));
    }
    return result;
  }

  async fetchGithubRepositoryInfo(): Promise<Repository[]> {
    const repoInfo = await this.githubAPI.fetchRepositoryInfo();
    const repos: Repository[] = [];
    repos.push(new Repository(
        repoInfo.data.id,
        repoInfo.data.name,
        repoInfo.data.created_at,
        repoInfo.data.updated_at,
        repoInfo.data.language || ''
    ));
    return repos;
  }

  fetchGithubWorkflowInfo(): Promise<Workflow[]> {
    return Workflow[1];
  }
}