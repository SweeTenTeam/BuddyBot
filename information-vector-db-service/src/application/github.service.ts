import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase';
import { GithubCmd } from 'src/domain/GithubCmd';
import { GithubAPIAdapter } from 'src/adapter/out/GithubAPIAdapter';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(private readonly githubApi: GithubAPIAdapter) {}
  
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
    return true;
  }
}
