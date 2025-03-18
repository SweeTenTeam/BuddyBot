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
  
  async fetchGithubCommitsInfo(): Promise<Commit[]> {
    const commitsInfo = await this.githubAPI.fetchCommitsInfo();
    const result: Commit[] = [];
    for(const commit of commitsInfo.data){
      const commitFileInfo = await this.githubAPI.fetchCommitModifiedFilesInfo(commit.sha);
      const filenames: string[] = []; //to change/fix
      for(const filename of commitFileInfo.data.files ?? []){
        filenames.push(filename.filename);;
      }
      result.push(new Commit(
        commit.sha,
        commit.commit.message,
        commit.commit.author?.date ?? '',
        filenames,
        commit.commit.author?.name ?? '',
      ));
    }
    return result;
  }

  async fetchGithubFilesInfo(): Promise<File[]> {
    const files = await this.githubAPI.fetchFilesInfo('master');
    const result: File[] = [];
    for(const file of files.data.tree){
      if(file.type !== 'blob') continue;
      if(file.size! > 1000) continue;
      const fileContents = await this.githubAPI.fetchFileInfo(file.path ?? '');
      let content = Buffer.from(fileContents.data.content.replaceAll("\n",""), 'base64') + '';
      result.push(new File(
        file.path ?? '',
        file.sha ?? '',
        content
      ));
    }
    return result;
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
        const pr_comments = await this.githubAPI.fetchPullRequestComments(pullRequest.number);
        pr_comments.concat(await this.githubAPI.fetchPullRequestReviewComments(pullRequest.number));
        const filenames = await this.githubAPI.fetchPullRequestModifiedFiles(pullRequest.number);
        result.push(new PullRequest(
            pullRequest.id,
            pullRequest.number,
            pullRequest.title,
            pullRequest.body || '',
            pullRequest.state,
            assignees,
            requested_reviewers,
            pr_comments, //to fix comments
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

  async fetchGithubWorkflowInfo(): Promise<Workflow[]> {
    const workflowInfo = await this.githubAPI.fetchWorkflowsInfo();
    const result: Workflow[] = [];
    for(const workflow of workflowInfo.data.workflows){
      result.push(new Workflow(
        workflow.id,
        workflow.name,
        workflow.state,
        workflow.state,
        workflow.state,
        workflow.state //to fix because wtf
      ));
    }
    return result;
  }
}