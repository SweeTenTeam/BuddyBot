import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';
import { FileCmd } from '../domain/command/FileCmd.js';
import { Commit } from '../domain/business/Commit.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(private readonly githubApi: GithubAPIAdapter) {}
  
  private extractFileCmdsFromCommits(commits: Commit[]): FileCmd[] {
    const fileCmds: FileCmd[] = [];
    
    for (const commit of commits) {
      for (const filename of commit.getModifiedFiles()) {
        const fileCmd = new FileCmd();
        fileCmd.path = filename;
        fileCmd.branch = commit.getBranch();
        fileCmds.push(fileCmd);
      }
    }
    
    return fileCmds;
  }
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean> {
    const commits = await this.githubApi.fetchGithubCommitsInfo(req);
    const fileCmds = this.extractFileCmdsFromCommits(commits);
    
    const files = await this.githubApi.fetchGithubFilesInfo(fileCmds);
    // const pullRequests = await this.githubApi.fetchGithubPullRequestsInfo(req);
    // const repository = await this.githubApi.fetchGithubRepositoryInfo(req);
    // const workflows = await this.githubApi.fetchGithubWorkflowInfo(req);

    //DEBUG
    console.log(commits);
    console.log(files);
    // console.log(pullRequests[0]);
    // console.log(repository);
    // console.log(workflows);

    //store logic
    return true;
  }
}
