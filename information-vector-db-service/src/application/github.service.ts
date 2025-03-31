import { Injectable } from '@nestjs/common';
import { GithubUseCase } from './port/in/GithubUseCase.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';
import { GithubStoreAdapter } from '../adapter/out/GithubStoreAdapter.js';
import { GithubInfo } from '../domain/business/GithubInfo.js';
import { FileCmd } from '../domain/command/FileCmd.js';
import { Commit } from '../domain/business/Commit.js';
import { WorkflowRunCmd } from '../domain/command/WorkflowRunCmd.js';
import { WorkflowRun } from '../domain/business/WorkflowRun.js';
import { Workflow } from '../domain/business/Workflow.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(
    private readonly githubApi: GithubAPIAdapter,
    private readonly githubStoreAdapter: GithubStoreAdapter
  ) {}
  

  
  
  //util function to get the updated files to download from the commits
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
  
  private async getWorkflowRuns(workflows: Workflow[], req: GithubCmd): Promise<WorkflowRun[]> {
    const workflowRuns: WorkflowRun[] = [];
    
    const repoCmdMap = new Map();
    for (const repoCmd of req.repoCmdList) {
      repoCmdMap.set(repoCmd.repoName, repoCmd);
    }
    
    for (const workflow of workflows) {
      const repoName = workflow.getRepositoryName();
      const repoCmd = repoCmdMap.get(repoName);
      
      if (repoCmd) {
        const workflowRunCmd = new WorkflowRunCmd();
        workflowRunCmd.workflow_id = workflow.getId();
        workflowRunCmd.workflow_name = workflow.getName();
        workflowRunCmd.owner = repoCmd.owner;
        workflowRunCmd.repository = repoCmd.repoName;
        workflowRunCmd.since_created = req.lastUpdate;
        
        const runs = await this.githubApi.fetchGithubWorkflowRuns(workflowRunCmd);
        workflowRuns.push(...runs);
      } else {
        console.warn(`No matching repository command found for workflow repository: ${repoName}`);
      }
    }
    
    return workflowRuns;
  }
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean> {
    const commits = await this.githubApi.fetchGithubCommitsInfo(req);
    // console.log(commits);
    const fileCmds = this.extractFileCmdsFromCommits(commits);

    const files = await this.githubApi.fetchGithubFilesInfo(fileCmds);
    // console.log(files)
    const pullRequests = await this.githubApi.fetchGithubPullRequestsInfo(req);
    // console.log(pullRequests)
    const repository = await this.githubApi.fetchGithubRepositoryInfo(req);
    // console.log(repository)
    const workflows = await this.githubApi.fetchGithubWorkflowInfo(req);
    // console.log(workflows)
    const workflowRuns = await this.getWorkflowRuns(workflows, req);
    // console.log(workflowRuns)


    //store logic
    await this.githubStoreAdapter.storeGithubInfo(new GithubInfo(commits,files,pullRequests,repository,workflows));
    return true;
  }
}
