import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';
import { FileCmd } from '../domain/command/FileCmd.js';
import { Commit } from '../domain/business/Commit.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(private readonly githubApi: GithubAPIAdapter) {}
  

  //utim function to get the updated files to download from the commits
  private extractFileCmdsFromCommits(commits: Commit[]): FileCmd[] {
    const fileCmds: FileCmd[] = [];
    const uniquePaths = new Set<string>();
    
    for (const commit of commits) {
      for (const filename of commit.getModifiedFiles()) {
        if (uniquePaths.has(filename)) continue;
        
        const fileCmd = new FileCmd();
        fileCmd.path = filename;
        fileCmd.owner = commit.getRepoOwner();
        fileCmd.branch = commit.getBranch();
        fileCmd.repository = commit.getRepoName();
        fileCmds.push(fileCmd);
        uniquePaths.add(filename);
      }
    }
    
    return fileCmds;
  }
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean> {
    const commits = await this.githubApi.fetchGithubCommitsInfo(req);
    const fileCmds = this.extractFileCmdsFromCommits(commits);

    const files = await this.githubApi.fetchGithubFilesInfo(fileCmds);
    const pullRequests = await this.githubApi.fetchGithubPullRequestsInfo(req);
    const repository = await this.githubApi.fetchGithubRepositoryInfo(req);
    const workflows = await this.githubApi.fetchGithubWorkflowInfo(req);

    //DEBUG
    
    // console.log(files.length);
    // console.log(pullRequests[0]);
    // console.log(repository);
    // console.log(workflows);

    //store logic
    return true;
  }
}
