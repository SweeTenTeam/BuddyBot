import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(private readonly githubApi: GithubAPIAdapter) {}
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean> {
    const commits = await this.githubApi.fetchGithubCommitsInfo(req);
    const files = await this.githubApi.fetchGithubFilesInfo(req);
    const pullRequests = await this.githubApi.fetchGithubPullRequestsInfo(req);
    const repository = await this.githubApi.fetchGithubRepositoryInfo(req);
    const workflows = await this.githubApi.fetchGithubWorkflowInfo(req);

    //DEBUG
    console.log(commits);
    console.log(files);
    console.log(pullRequests[0]);
    console.log(repository);
    console.log(workflows);

    //store logic
    return true;
  }
}
