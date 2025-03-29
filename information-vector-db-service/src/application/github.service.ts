import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';
import { GithubStoreAdapter } from 'src/adapter/out/GithubStoreAdapter.js';
import { GithubInfo } from 'src/domain/business/GithubInfo.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(
    private readonly githubApi: GithubAPIAdapter,
    private readonly githubStoreAdapter: GithubStoreAdapter
  ) {}
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean> {
    const commits = await this.githubApi.fetchGithubCommitsInfo();
    const files = await this.githubApi.fetchGithubFilesInfo();
    const pullRequests = await this.githubApi.fetchGithubPullRequestsInfo();
    const repository = await this.githubApi.fetchGithubRepositoryInfo();
    const workflows = await this.githubApi.fetchGithubWorkflowInfo();

    //DEBUG
    console.log(commits);
    console.log(files);
    console.log(pullRequests[0]);
    console.log(repository);
    console.log(workflows);

    //store logic
    await this.githubStoreAdapter.storeGithubInfo(new GithubInfo(commits,files,pullRequests,repository,workflows));
    return true;
  }
}
