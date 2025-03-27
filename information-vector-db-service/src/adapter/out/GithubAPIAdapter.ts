import { GithubCommitsAPIPort } from "../../application/port/out/GithubCommitAPIPort.js";
import { GithubFilesAPIPort } from "../../application/port/out/GithubFilesAPIPort.js";
import { GithubPullRequestsAPIPort } from "../../application/port/out/GithubPullRequestsAPIPort.js";
import { GithubRepositoryAPIPort } from "../../application/port/out/GithubRepositoryAPIPort.js";
import { GithubWorkflowsAPIPort } from "../../application/port/out/GithubWorkflowsAPIPort.js";
import { GithubAPIFacade } from "./GithubAPIFacade.js";
import { Injectable } from '@nestjs/common';
import { Commit } from "../../domain/business/Commit.js";
import { File } from "../../domain/business/File.js";
import { PullRequest } from "../../domain/business/PullRequest.js";
import { Repository } from "../../domain/business/Repository.js";
import { Workflow } from "../../domain/business/Workflow.js";
import { WorkflowRun } from "../../domain/business/WorkflowRun.js";
import { GithubCmd } from "src/domain/command/GithubCmd.js";
import { FileCmd } from "src/domain/command/FileCmd.js";

@Injectable()
export class GithubAPIAdapter implements GithubCommitsAPIPort, GithubFilesAPIPort, GithubPullRequestsAPIPort, GithubRepositoryAPIPort, GithubWorkflowsAPIPort{
  private readonly githubAPI: GithubAPIFacade;
  constructor(githubAPI: GithubAPIFacade) {
    this.githubAPI = githubAPI;
  }
  
  async fetchGithubCommitsInfo(req: GithubCmd): Promise<Commit[]> {
    const result: Commit[] = [];
    
    for (const repoCmd of req.repoCmdList) {
      const commitsInfo = await this.githubAPI.fetchCommitsInfo(repoCmd.owner, repoCmd.repoName, repoCmd.branch_name, req.lastUpdate);
      
      for(const commit of commitsInfo.data){
        const commitFileInfo = await this.githubAPI.fetchCommitModifiedFilesInfo(repoCmd.owner, repoCmd.repoName, commit.sha);
        const filenames: string[] = []; //to change/fix
        for(const filename of commitFileInfo.data.files ?? []){
          filenames.push(filename.filename);
        }
        result.push(new Commit(
          repoCmd.repoName,
          repoCmd.owner,
          repoCmd.branch_name,
          commit.sha,
          commit.commit.message,
          commit.commit.author?.date ?? '',
          filenames,
          commit.commit.author?.name ?? '',
        ));
      }
    }
    return result;
  }

  private isTextFile(filename: string): boolean {
    const binaryExtensions = [
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.ico',
      // PDFs
      '.pdf',
      // Videos
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv',
      // Compiled artifacts
      '.exe', '.dll', '.so', '.dylib', '.class', '.jar', '.war',
      '.o', '.obj', '.out', '.bin', '.dat', '.db', '.sqlite',
      // Archives
      '.zip', '.rar', '.7z', '.tar', '.gz',
      // Fonts
      '.ttf', '.otf', '.woff', '.woff2', '.eot',
      // Other binary files
      '.xlsx', '.xls', '.doc', '.docx', '.ppt', '.pptx',
      //other format not wanted
      '.env'
    ];
    
    return !binaryExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  
//if a file is not found the method continue as commits can delete files or move it in new location
  async fetchGithubFilesInfo(req: FileCmd[]): Promise<File[]> {
    const result: File[] = [];
    
    for (const fileCmd of req) {
      if (!this.isTextFile(fileCmd.path)) continue;
      
      try {
        const fileContents = await this.githubAPI.fetchFileInfo(fileCmd.path, fileCmd.owner, fileCmd.repository, fileCmd.branch);
        let content = Buffer.from(fileContents.data.content.replaceAll("\n",""), 'base64') + '';
        
        result.push(new File(
          fileContents.data.path,
          fileContents.data.sha,
          fileCmd.repository,
          fileCmd.branch,
          content
        ));
      } catch (error: any) {
        if (error.status === 404) {
          console.log(`File not found (404): ${fileCmd.path}`);
          continue;
        }
        console.error(`Error accessing ${fileCmd.path}: ${error.message}`);
        throw error;
      }
    }
    
    return result;
  }

  async fetchGithubPullRequestsInfo(req: GithubCmd): Promise<PullRequest[]> {
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


// No way of getting only the repositories that were updated in the last "now - last_update" days,
// we dowload all the repos info but we return only the ones that were created or updated in the last "now - last_update" days
  async fetchGithubRepositoryInfo(req: GithubCmd): Promise<Repository[]> {
    const repos: Repository[] = [];
    const lastUpdate = req.lastUpdate;
    
    for (const repoCmd of req.repoCmdList) {
      const repoInfo = await this.githubAPI.fetchRepositoryInfo(repoCmd);
      
      if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        const createdDate = new Date(repoInfo.data.created_at);
        const updatedDate = new Date(repoInfo.data.updated_at);
        
        if (createdDate >= lastUpdateDate || updatedDate >= lastUpdateDate) {
          repos.push(new Repository(
            repoInfo.data.id,
            repoInfo.data.name,
            repoInfo.data.created_at,
            repoInfo.data.updated_at,
            repoInfo.data.language || ''
          ));
        }
      } else {
        repos.push(new Repository(
          repoInfo.data.id,
          repoInfo.data.name,
          repoInfo.data.created_at,
          repoInfo.data.updated_at,
          repoInfo.data.language || ''
        ));
      }
    }
    
    return repos;
  }

  async fetchGithubWorkflowInfo(req: GithubCmd): Promise<Workflow[]> {
    const workflowInfo = await this.githubAPI.fetchWorkflowsInfo();
    const result: Workflow[] = [];
    
    for (const workflow of workflowInfo) {
      const workflowRuns = workflow.runs.map(run => new WorkflowRun(
        run.id,
        run.status,
        run.duration,
        run.log,
        run.trigger
      ));
      
      result.push(new Workflow(
        workflow.id,
        workflow.name,
        workflow.state,
        workflowRuns
      ));
    }
    
    return result;
  }
}