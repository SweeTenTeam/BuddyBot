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
    const params = lastUpdate 
      ? { 
          owner, 
          repo: repoName,
          sha: branch,
          per_page: 100,
          since: lastUpdate.toISOString()
        }
      : { 
          owner, 
          repo: repoName, 
          sha: branch,
          per_page: 100
        };

    const allCommits = await this.octokit.paginate(
      this.octokit.rest.repos.listCommits,
      params
    );

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
    try {
      const pulls = await this.octokit.paginate(
        this.octokit.rest.pulls.list,
        {
          owner: owner,
          repo: repoName,
          state: 'all',
          base: baseBranchName,
          per_page: 100
        }
      );

      return {
        data: pulls,
        status: 200,
        headers: {},
        url: ''
      } as OctokitTypes.OctokitResponse<{id: number, number: number, title: string, body: string | null, state: string, assignees?: {login: string}[] | undefined | null, requested_reviewers?: {login: string}[] | null, head: {ref: string}, base: {ref: string}}[], 200>;
    } catch (error) {
      console.error(`Failed to fetch pull requests for base branch ${baseBranchName}:`, error);
      throw error;
    }
  }


  async fetchPullRequestModifiedFiles(owner: string, repoName:string, pull_number: number): Promise<string[]> {
    try {
      const files = await this.octokit.paginate(
        this.octokit.rest.pulls.listFiles,
        {
          owner: owner,
          repo: repoName,
          pull_number: pull_number,
          per_page: 100
        }
      );

      return files.map(file => file.filename);
    } catch (error) {
      console.error(`Failed to fetch modified files for PR #${pull_number}:`, error);
      throw error;
    }
  }

  async fetchPullRequestReviewComments(owner: string, repoName:string, pull_number: number) {
    try {
      const comments = await this.octokit.paginate(
        this.octokit.pulls.listReviewComments,
        {
          owner: owner,
          repo: repoName,
          pull_number: pull_number,
          per_page: 100
        }
      );

      return {
        data: comments,
        status: 200,
        headers: {},
        url: ''
      } as OctokitTypes.OctokitResponse<any[], 200>;
    } catch (error) {
      console.error(`Failed to fetch review comments for PR #${pull_number}:`, error);
      throw error;
    }
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
    state: string
  }[]> {
    try {
      const workflows = await this.octokit.paginate(
        this.octokit.rest.actions.listRepoWorkflows,
        {
          owner: owner,
          repo: repoName,
          per_page: 100
        }
      );

      return workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        state: workflow.state
      }));
    } catch (error) {
      console.error(`Failed to fetch workflows for repo ${owner}/${repoName}:`, error);
      throw error;
    }
  }

  async fetchWorkflowRuns(owner: string, repoName:string, workflow_id: number, since_created?: Date): Promise<{
    id: number;
    status: string;
    duration: number;
    log: string;
    trigger: string;
  }[]> {
    try {
      const params: any = {
        owner: owner,
        repo: repoName,
        workflow_id,
        per_page: 100
      };
      
      // Add created date filter if provided
      if (since_created) {
        // Format as >=YYYY-MM-DD for GitHub API date filtering
        params.created = `>=${since_created.toISOString().split('T')[0]}`;
      }
      
      const runs = await this.octokit.paginate(
        this.octokit.rest.actions.listWorkflowRuns,
        params
      );

      return runs.map((run: any) => {
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
    } catch (error) {
      console.error(`Failed to fetch workflow runs for workflow ${workflow_id}:`, error);
      throw error;
    }
  }
  
}