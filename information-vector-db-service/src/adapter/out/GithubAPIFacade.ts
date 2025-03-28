import { Octokit } from '@octokit/rest'
import type * as OctokitTypes from "@octokit/types";
import { Workflow } from '../../domain/business/Workflow.js';
import { WorkflowRun } from '../../domain/business/WorkflowRun.js';
import { RepoCmd } from 'src/domain/command/RepoCmd.js';

export class GithubAPIFacade{
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;
  constructor() {
    this.octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN || 'your_github_token'
    });
    this.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
    this.repo = process.env.GITHUB_REPO || 'Docs';
  }

async fetchCommitsInfo(owner: string, repoName: string, branch: string, lastUpdate?: Date): Promise<OctokitTypes.OctokitResponse<{sha: string, commit: {author: {name?: string, date?: string} | null, message: string}}[], 200>> {
  try {
    let allCommits: any[] = [];
    let hasMorePages = true;
    let currentUrl: string | undefined;

    while (hasMorePages) {
      const params = lastUpdate 
        ? { 
            owner, 
            repo: repoName,
            sha: branch,
            per_page:100,
            since: lastUpdate.toISOString()
          }
        : { 
            owner, 
            repo: repoName, 
            sha: branch,
            per_page:100
          };

      const response = currentUrl 
        ? await this.octokit.request(currentUrl)
        : await this.octokit.rest.repos.listCommits(params);
      
      if (!response.data.length) break;
      
      allCommits.push(...response.data);

      const linkHeader = response.headers.link;
      if (!linkHeader) {
        hasMorePages = false;
        break;
      }

      const nextMatch = linkHeader.match(/<([^>]+)>; rel="next"/);
      currentUrl = nextMatch ? nextMatch[1] : undefined;
      hasMorePages = !!currentUrl;
    }

    return {
      data: allCommits,
      status: 200,
      headers: {},
      url: ''
    } as OctokitTypes.OctokitResponse<{sha: string, commit: {author: {name?: string, date?: string} | null, message: string}}[], 200>;
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    throw error;
  }
}

  async fetchCommitModifiedFilesInfo(owner: string, repoName: string, commitSha: string): Promise<OctokitTypes.OctokitResponse<{files?: {filename: string, patch?: string | undefined}[]}, 200>> {
    try {
      let allFiles: any[] = [];
      let hasMorePages = true;
      let currentUrl: string | undefined;
      let lastResponse: any;

      while (hasMorePages) {
        lastResponse = currentUrl 
          ? await this.octokit.request(currentUrl)
          : await this.octokit.rest.repos.getCommit({
              owner: owner,
              repo: repoName,
              per_page:100,
              ref: commitSha
            });

        if (!lastResponse.data.files?.length) break;
        
        allFiles.push(...lastResponse.data.files);

        const linkHeader = lastResponse.headers.link;
        if (!linkHeader) {
          hasMorePages = false;
          break;
        }

        const nextMatch = linkHeader.match(/<([^>]+)>; rel="next"/);
        currentUrl = nextMatch ? nextMatch[1] : undefined;
        hasMorePages = !!currentUrl;
      }

      return {
        data: {
          ...lastResponse.data,
          files: allFiles
        },
        status: 200,
        headers: {},
        url: ''
      } as OctokitTypes.OctokitResponse<{files?: {filename: string, patch?: string | undefined}[]}, 200>;
    } catch (error) {
      console.error(`Failed to fetch modified files for commit ${commitSha}:`, error);
      throw error;
    }
  }

  // async fetchFilesInfo(branch_name: string): Promise<OctokitTypes.OctokitResponse<{tree: {name?: string, path?: string, type?: string, sha?: string, size?: number}[]}, 200>> {
  //   const data = await this.octokit.rest.git.getTree({
  //     owner: this.owner,
  //     repo: this.repo,
  //     tree_sha: branch_name, //can also be the branch's name
  //     recursive: 'true',
  //   });

  //   return data;
  // }

  async fetchFileInfo(path: string, owner: string, repo: string, branch:string): Promise<OctokitTypes.OctokitResponse<{name: string, path: string, content?: string, sha: string} | any, 200>> {
    const data = await this.octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      ref:branch,
      path: path
    });

    return data;
  }

  async fetchRawFileContent(owner: string, repo: string, path: string, branch: string): Promise<string> {
    try {
      console.log("insisde fetch raw")
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        ref: branch,
        headers: {
          accept: 'application/vnd.github.raw'
        }
      });

      if (typeof response.data !== 'string') {
        throw new Error('Expected string response for raw content');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }

  async fetchPullRequestsInfo(owner: string, repoName:string, baseBranchName: string): Promise<OctokitTypes.OctokitResponse<{id: number, number: number, title: string, body: string | null, state: string, assignees?: {login: string}[] | undefined | null, requested_reviewers?: {login: string}[] | null, head: {ref: string}, base: {ref: string}}[], 200>> {
    const data = await this.octokit.rest.pulls.list({
        owner: owner,
        repo: repoName,
        state: 'all',
        base: baseBranchName
    });
    return data;
  }

  async fetchPullRequestInfo(owner: string, repoName:string): Promise<OctokitTypes.OctokitResponse<{}, 200>> {
    const data = await this.octokit.rest.pulls.get({
        owner: owner,
        repo: repoName,
        pull_number: 1 
        
    });
    return data;
  }

  async fetchPullRequestModifiedFiles(owner: string, repoName:string, pull_number: number): Promise<string[]> {
    const data = await this.octokit.rest.pulls.listFiles({
        owner: owner,
        repo: repoName,
        pull_number: pull_number
    });

    const filenames: string[] = [];
    for(const file of data.data){
        filenames.push(file.filename);
    }
    return filenames;
  }

  async fetchPullRequestReviewComments(owner: string, repoName:string, pull_number: number) {
    const data = await this.octokit.pulls.listReviewComments({
        owner: owner,
        repo: repoName,
        pull_number: pull_number,
    });
    return data;
  }
  
  async fetchRepositoryInfo(owner: string, repoName:string): Promise<OctokitTypes.OctokitResponse<{id: number, name: string, created_at: string, updated_at: string, language: string | null}, 200>>{ //wtf
    const data = await this.octokit.rest.repos.get({
        owner: owner,
        repo: repoName,
    });
    return data;
  }

  async fetchWorkflowsInfo(owner: string, repoName:string): Promise<{
    id: number,
    name: string,
    state: string,
    runs: {
      id: number,
      status: string,
      duration: number,
      log: string,
      trigger: string
    }[]
  }[]> {
    const data = await this.octokit.rest.actions.listRepoWorkflows({
      owner: owner,
      repo: repoName
    });

    // Create an array of promises for parallel execution
    const workflowPromises = data.data.workflows.map(async (workflow) => {
      let runs: {
        id: number,
        status: string,
        duration: number,
        log: string,
        trigger: string
      }[] = [];
      
      try {
        runs = await this.fetchWorkflowRuns(owner, repoName, workflow.id);
      } catch (error) {
        console.warn(`No runs found for workflow ${workflow.id}: ${error.message}`);
      }

      return {
        id: workflow.id,
        name: workflow.name,
        state: workflow.state,
        runs
      };
    });

    return Promise.all(workflowPromises);
  }

  async fetchWorkflowRuns(owner: string, repoName:string, workflow_id: number): Promise<{
    id: number;
    status: string;
    duration: number;
    log: string;
    trigger: string;
  }[]> {
    let allRuns: any[] = [];
    let page = 1;

    while (true) {
      const { data } = await this.octokit.rest.actions.listWorkflowRuns({
        owner: owner,
        repo: repoName,
        workflow_id,
        per_page: 100,
        page
      });

      if (!data.workflow_runs.length) break;

      allRuns.push(...data.workflow_runs);
      page++;

      if (data.workflow_runs.length < 100) break;
    }

    if (!allRuns.length) throw new Error('No workflow runs found');

    return allRuns.map((run) => {
      const startTime = new Date(run.run_started_at || run.created_at);
      const endTime = run.updated_at ? new Date(run.updated_at) : new Date();
      return {
        id: run.id,
        status: run.status || 'unknown',
        duration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
        log: run.html_url || '',
        trigger: run.event || 'unknown'
      };
    });
  }

//const githubAPI = new GithubAPIFacade();
//async function ziomela(): Promise<void> {
//  console.log(await githubAPI.fetchPullRequestsInfo()); //127703483 //124129218
//}
//ziomela();

}