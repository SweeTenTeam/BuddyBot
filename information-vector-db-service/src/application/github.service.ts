import { Inject, Injectable } from '@nestjs/common';
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
import { GITHUB_STORE_INFO_PORT, GithubStoreInfoPort } from './port/out/GithubStoreInfoPort.js';
import { GITHUB_COMMITS_API_PORT, GithubCommitsAPIPort } from './port/out/GithubCommitAPIPort.js';
import { GITHUB_FILES_API_PORT, GithubFilesAPIPort } from './port/out/GithubFilesAPIPort.js';
import { GITHUB_PULL_REQUESTS_API_PORT, GithubPullRequestsAPIPort } from './port/out/GithubPullRequestsAPIPort.js';
import { GITHUB_REPOSITORY_API_PORT, GithubRepositoryAPIPort } from './port/out/GithubRepositoryAPIPort.js';
import { GITHUB_WORKFLOWS_API_PORT, GithubWorkflowsAPIPort } from './port/out/GithubWorkflowsAPIPort.js';
import { Result } from '../domain/business/Result.js';

@Injectable()
export class GithubService implements GithubUseCase {
  constructor(
    @Inject(GITHUB_COMMITS_API_PORT) private readonly githubCommitsApi: GithubCommitsAPIPort,
    @Inject(GITHUB_FILES_API_PORT) private readonly githubFilesApi: GithubFilesAPIPort,
    @Inject(GITHUB_PULL_REQUESTS_API_PORT) private readonly githubPullRequestsApi: GithubPullRequestsAPIPort,
    @Inject(GITHUB_REPOSITORY_API_PORT) private readonly githubRepositoryApi: GithubRepositoryAPIPort,
    @Inject(GITHUB_WORKFLOWS_API_PORT) private readonly githubWorkflowsApi: GithubWorkflowsAPIPort,
    @Inject(GITHUB_STORE_INFO_PORT) private readonly githubStoreAdapter: GithubStoreInfoPort
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
        
        const runs = await this.githubWorkflowsApi.fetchGithubWorkflowRuns(workflowRunCmd);
        workflowRuns.push(...runs);
      } else {
        console.warn(`No matching repository command found for workflow repository: ${repoName}`);
      }
    }
    
    return workflowRuns;
  }
  
  async fetchAndStoreGithubInfo(req: GithubCmd): Promise<Result> {
    try {
      const commits = await this.githubCommitsApi.fetchGithubCommitsInfo(req);
      console.log(commits);
      const fileCmds = this.extractFileCmdsFromCommits(commits);
      const files = await this.githubFilesApi.fetchGithubFilesInfo(fileCmds);
      console.log(files);
      const pullRequests = await this.githubPullRequestsApi.fetchGithubPullRequestsInfo(req);
      const repository = await this.githubRepositoryApi.fetchGithubRepositoryInfo(req);
      const workflows = await this.githubWorkflowsApi.fetchGithubWorkflowInfo(req);
      const workflowRuns = await this.getWorkflowRuns(workflows, req);

      const result = await this.githubStoreAdapter.storeGithubInfo(new GithubInfo(commits, files, pullRequests, repository, workflows, workflowRuns));
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }
}
