import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { GithubService } from './github.service.js';
import { GithubAPIAdapter } from '../adapter/out/GithubAPIAdapter.js';
import { GithubStoreAdapter } from '../adapter/out/GithubStoreAdapter.js';
import { GithubInfo } from '../domain/business/GithubInfo.js';
import { Result } from '../domain/business/Result.js';
import { Commit } from '../domain/business/Commit.js';
import { File } from '../domain/business/File.js';
import { PullRequest } from '../domain/business/PullRequest.js';
import { Repository } from '../domain/business/Repository.js';
import { Workflow } from '../domain/business/Workflow.js';
import { WorkflowRun } from '../domain/business/WorkflowRun.js';
import { GithubCmd } from '../domain/command/GithubCmd.js';
import { RepoCmd } from '../domain/command/RepoCmd.js';
import { GITHUB_COMMITS_API_PORT } from '../application/port/out/GithubCommitAPIPort.js';
import { GITHUB_FILES_API_PORT } from '../application/port/out/GithubFilesAPIPort.js';
import { GITHUB_PULL_REQUESTS_API_PORT } from '../application/port/out/GithubPullRequestsAPIPort.js';
import { GITHUB_REPOSITORY_API_PORT } from '../application/port/out/GithubRepositoryAPIPort.js';
import { GITHUB_WORKFLOWS_API_PORT } from '../application/port/out/GithubWorkflowsAPIPort.js';
import { GITHUB_STORE_INFO_PORT } from '../application/port/out/GithubStoreInfoPort.js';

describe('GithubService', () => {
  let service: GithubService;
  let apiAdapter: jest.Mocked<GithubAPIAdapter>;
  let storeAdapter: jest.Mocked<GithubStoreAdapter>;

  beforeEach(async () => {
    const mockApiAdapter = {
      fetchGithubCommitsInfo: jest.fn(),
      fetchGithubFilesInfo: jest.fn(),
      fetchGithubPullRequestsInfo: jest.fn(),
      fetchGithubRepositoryInfo: jest.fn(),
      fetchGithubWorkflowInfo: jest.fn(),
      fetchGithubWorkflowRuns: jest.fn(),
    };

    const mockStoreAdapter = {
      storeGithubInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: GITHUB_COMMITS_API_PORT,
          useValue: mockApiAdapter,
        },
        {
          provide: GITHUB_FILES_API_PORT,
          useValue: mockApiAdapter,
        },
        {
          provide: GITHUB_PULL_REQUESTS_API_PORT, 
          useValue: mockApiAdapter,
        },
        {
          provide: GITHUB_REPOSITORY_API_PORT,
          useValue: mockApiAdapter,
        },
        {
          provide: GITHUB_WORKFLOWS_API_PORT,
          useValue: mockApiAdapter,
        },
        {
          provide: GITHUB_STORE_INFO_PORT,
          useValue: mockStoreAdapter,
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    apiAdapter = module.get(GITHUB_COMMITS_API_PORT);
    storeAdapter = module.get(GITHUB_STORE_INFO_PORT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndStoreGithubInfo', () => {
    it('should fetch and store GitHub information successfully', async () => {
      // Arrange
      const commits = [
        new Commit('repo1', 'owner1', 'main', 'sha1', 'message1', '2023-01-01', ['file1.js'], 'author1'),
      ];
      
      const files = [
        new File('file1.js', 'sha1', 'repo1', 'main', 'content1'),
      ];
      
      const pullRequests = [
        new PullRequest(1, 1, 'title1', 'body1', 'open', ['assignee1'], ['reviewer1'], [], ['file1.js'], 'feature', 'main', 'repo1'),
      ];
      
      const repos = [
        new Repository(1, 'repo1', '2023-01-01', '2023-01-02', 'TypeScript'),
      ];
      
      const workflows = [
        new Workflow(1, 'workflow1', 'active', 'repo1'),
      ];
      
      const workflowRuns = [
        new WorkflowRun(1, 'completed', 120, 'log1', 'push', 1, 'workflow1'),
      ];
      
      const githubInfo = new GithubInfo(commits, files, pullRequests, repos, workflows, workflowRuns);
      
      const repoCmd = new RepoCmd('owner1', 'repo1', 'main');
      const githubCmd = new GithubCmd([repoCmd]);
      
      apiAdapter.fetchGithubCommitsInfo.mockResolvedValue(commits);
      apiAdapter.fetchGithubFilesInfo.mockResolvedValue(files);
      apiAdapter.fetchGithubPullRequestsInfo.mockResolvedValue(pullRequests);
      apiAdapter.fetchGithubRepositoryInfo.mockResolvedValue(repos);
      apiAdapter.fetchGithubWorkflowInfo.mockResolvedValue(workflows);
      apiAdapter.fetchGithubWorkflowRuns.mockResolvedValue(workflowRuns);
      
      storeAdapter.storeGithubInfo.mockResolvedValue(Result.ok());
      
      // Act
      const result = await service.fetchAndStoreGithubInfo(githubCmd);
      
      // Assert
      expect(result.success).toBe(true);
      expect(apiAdapter.fetchGithubCommitsInfo).toHaveBeenCalledWith(githubCmd);
      expect(apiAdapter.fetchGithubFilesInfo).toHaveBeenCalled();
      expect(apiAdapter.fetchGithubPullRequestsInfo).toHaveBeenCalledWith(githubCmd);
      expect(apiAdapter.fetchGithubRepositoryInfo).toHaveBeenCalledWith(githubCmd);
      expect(apiAdapter.fetchGithubWorkflowInfo).toHaveBeenCalledWith(githubCmd);
      expect(apiAdapter.fetchGithubWorkflowRuns).toHaveBeenCalled();
      expect(storeAdapter.storeGithubInfo).toHaveBeenCalledWith(githubInfo);
    });
    
    it('should handle errors when fetching GitHub information', async () => {
      // Arrange
      const repoCmd = new RepoCmd('owner1', 'repo1', 'main');
      const githubCmd = new GithubCmd([repoCmd]);
      const error = new Error('API error');
      apiAdapter.fetchGithubCommitsInfo.mockRejectedValue(error);
      
      // Act
      const result = await service.fetchAndStoreGithubInfo(githubCmd);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(storeAdapter.storeGithubInfo).not.toHaveBeenCalled();
    });
    
    it('should handle errors when storing GitHub information', async () => {
      // Arrange
      const commits = [
        new Commit('repo1', 'owner1', 'main', 'sha1', 'message1', '2023-01-01', ['file1.js'], 'author1'),
      ];
      
      const files = [
        new File('file1.js', 'sha1', 'repo1', 'main', 'content1'),
      ];
      
      const pullRequests = [
        new PullRequest(1, 1, 'title1', 'body1', 'open', ['assignee1'], ['reviewer1'], [], ['file1.js'], 'feature', 'main', 'repo1'),
      ];
      
      const repos = [
        new Repository(1, 'repo1', '2023-01-01', '2023-01-02', 'TypeScript'),
      ];
      
      const workflows = [
        new Workflow(1, 'workflow1', 'active', 'repo1'),
      ];
      
      const workflowRuns = [
        new WorkflowRun(1, 'completed', 120, 'log1', 'push', 1, 'workflow1'),
      ];
      
      const repoCmd = new RepoCmd('owner1', 'repo1', 'main');
      const githubCmd = new GithubCmd([repoCmd]);
      
      apiAdapter.fetchGithubCommitsInfo.mockResolvedValue(commits);
      apiAdapter.fetchGithubFilesInfo.mockResolvedValue(files);
      apiAdapter.fetchGithubPullRequestsInfo.mockResolvedValue(pullRequests);
      apiAdapter.fetchGithubRepositoryInfo.mockResolvedValue(repos);
      apiAdapter.fetchGithubWorkflowInfo.mockResolvedValue(workflows);
      apiAdapter.fetchGithubWorkflowRuns.mockResolvedValue(workflowRuns);
      
      const error = new Error('Storage error');
      storeAdapter.storeGithubInfo.mockRejectedValue(error);
      
      // Act
      const result = await service.fetchAndStoreGithubInfo(githubCmd);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should handle empty results from API calls', async () => {
      // Arrange
      const repoCmd = new RepoCmd('owner1', 'repo1', 'main');
      const githubCmd = new GithubCmd([repoCmd]);
      
      apiAdapter.fetchGithubCommitsInfo.mockResolvedValue([]);
      apiAdapter.fetchGithubFilesInfo.mockResolvedValue([]);
      apiAdapter.fetchGithubPullRequestsInfo.mockResolvedValue([]);
      apiAdapter.fetchGithubRepositoryInfo.mockResolvedValue([]);
      apiAdapter.fetchGithubWorkflowInfo.mockResolvedValue([]);
      apiAdapter.fetchGithubWorkflowRuns.mockResolvedValue([]);
      
      storeAdapter.storeGithubInfo.mockResolvedValue(Result.ok());
      
      // Act
      const result = await service.fetchAndStoreGithubInfo(githubCmd);
      
      // Assert
      expect(result.success).toBe(true);
      expect(storeAdapter.storeGithubInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          commits: [],
          files: [],
          pullRequests: [],
          repos: [],
          workflows: [],
          workflow_runs: []
        })
      );
    });
  });
}); 