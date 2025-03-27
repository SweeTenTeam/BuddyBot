import { Test, TestingModule } from '@nestjs/testing';
import { GithubAPIAdapter } from './GithubAPIAdapter.js';
import { GithubAPIFacade } from './GithubAPIFacade.js';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';

describe('GithubAPIAdapter Integration Tests', () => {
  let adapter: GithubAPIAdapter;
  let githubAPI: GithubAPIFacade;

  beforeEach(() => {
    githubAPI = new GithubAPIFacade();
    adapter = new GithubAPIAdapter(githubAPI);
  });

//   it('should fetch commits and their modified files', async () => {
//     const commits = await adapter.fetchGithubCommitsInfo(new GithubCmd());
//     console.log('Fetched commits:', commits);
//     expect(commits).toBeDefined();
//     expect(Array.isArray(commits)).toBe(true);
//     if (commits.length > 0) {
//       expect(commits[0]).toHaveProperty('sha');
//       expect(commits[0]).toHaveProperty('message');
//       expect(commits[0]).toHaveProperty('author');
//       expect(commits[0]).toHaveProperty('files');
//     }
//   });

//   it('should fetch files with content', async () => {
//     const files = await adapter.fetchGithubFilesInfo(new GithubCmd());
//     console.log('Fetched files:', files);
//     expect(files).toBeDefined();
//     expect(Array.isArray(files)).toBe(true);
//     if (files.length > 0) {
//       expect(files[0]).toHaveProperty('path');
//       expect(files[0]).toHaveProperty('sha');
//       expect(files[0]).toHaveProperty('content');
//     }
//   });

//   it('should fetch pull requests with all related information', async () => {
//     const pullRequests = await adapter.fetchGithubPullRequestsInfo(new GithubCmd());
//     console.log('Fetched pull requests:', pullRequests);
//     expect(pullRequests).toBeDefined();
//     expect(Array.isArray(pullRequests)).toBe(true);
//     if (pullRequests.length > 0) {
//       expect(pullRequests[0]).toHaveProperty('id');
//       expect(pullRequests[0]).toHaveProperty('number');
//       expect(pullRequests[0]).toHaveProperty('title');
//       expect(pullRequests[0]).toHaveProperty('state');
//       expect(pullRequests[0]).toHaveProperty('assignees');
//       expect(pullRequests[0]).toHaveProperty('requested_reviewers');
//       expect(pullRequests[0]).toHaveProperty('files');
//     }
//   });

  it('should fetch repository information', async () => {
    const githubCmd = new GithubCmd();
    githubCmd.lastUpdate = new Date(Date.now());
    const repoCmd = new RepoCmd();
    repoCmd.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
    repoCmd.repoName = process.env.GITHUB_REPO || 'Docs';
    githubCmd.repoCmdList = [repoCmd];

    const repositories = await adapter.fetchGithubRepositoryInfo(githubCmd);
    console.log('Fetched repositories:', repositories);
    expect(repositories).toBeDefined();
    expect(Array.isArray(repositories)).toBe(true);
    if (repositories.length > 0) {
      expect(repositories[0]).toHaveProperty('id');
      expect(repositories[0]).toHaveProperty('name');
      expect(repositories[0]).toHaveProperty('createdAt');
      expect(repositories[0]).toHaveProperty('lastUpdate');
      expect(repositories[0]).toHaveProperty('mainLanguage');
    }
  });

//   it('should fetch workflow information', async () => {
//     const workflows = await adapter.fetchGithubWorkflowInfo(new GithubCmd());
//     console.log('Fetched workflows:', workflows);
//     expect(workflows).toBeDefined();
//     expect(Array.isArray(workflows)).toBe(true);
//     if (workflows.length > 0) {
//       expect(workflows[0]).toHaveProperty('id');
//       expect(workflows[0]).toHaveProperty('name');
//       expect(workflows[0]).toHaveProperty('state');
//       const runs = workflows[0].getRuns();
//       expect(Array.isArray(runs)).toBe(true);
//       if (runs.length > 0) {
//         expect(runs[0]).toHaveProperty('id');
//         expect(runs[0]).toHaveProperty('status');
//         expect(runs[0]).toHaveProperty('duration');
//         expect(runs[0]).toHaveProperty('log');
//         expect(runs[0]).toHaveProperty('trigger');
//       }
//     }
//   });
}); 