import { Octokit } from '@octokit/rest'
import type * as OctokitTypes from "@octokit/types";

export class GithubAPIFacade{
  private readonly octokit: Octokit;
  constructor() {
    this.octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN || 'your_github_token'
    });
  }

  async fetchPullRequestsInfo(): Promise<OctokitTypes.OctokitResponse<{id: number, number: number, title: string, body: string | null, state: string, assignees?: {login: string}[] | undefined | null, requested_reviewers?: {login: string}[] | null, head: {ref: string}, base: {ref: string}}[], 200>> {
    const data = await this.octokit.rest.pulls.list({
        owner: 'SweeTenTeam',
        repo: 'Docs',
        state: 'closed'
    });
    console.log(data);
    return data;
  }

  async fetchPullRequestInfo(): Promise<OctokitTypes.OctokitResponse<{}, 200>> {
    const data = await this.octokit.rest.pulls.get({
        owner: 'SweeTenTeam',
        repo: 'Ginnastica',
        pull_number: 1 
        
    });
    console.log(data.data);
    return data;
  }

  async fetchPullRequestModifiedFiles(pull_number: number): Promise<string[]> {
    const data = await this.octokit.rest.pulls.listFiles({
        owner: 'SweeTenTeam',
        repo: 'Ginnastica',
        pull_number: pull_number
    });

    const filenames: string[] = [];
    for(const file of data.data){
        filenames.push(file.filename);
    }
    console.log(filenames);
    return filenames;
  }

  async fetchPullRequestComments(pull_number: number): Promise<string[]> {
    const data = await this.octokit.pulls.listReviewComments({
        owner: 'SweeTenTeam',
        repo: 'Ginnastica',
        pull_number: pull_number,
    });
    return [];
  }
  
  async fetchRepositoryInfo(): Promise<OctokitTypes.OctokitResponse<{id: number, name: string, created_at: string, updated_at: string, language: string | null}, 200>>{ //wtf
    const data = await this.octokit.rest.repos.get({
        owner: 'SweeTenTeam',
        repo: 'BuddyBot',
    });
    return data;
  }

}

const githubAPI = new GithubAPIFacade();
async function ziomela(): Promise<void> {
    (await githubAPI.fetchPullRequestInfo());
}
ziomela();