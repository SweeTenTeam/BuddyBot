import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { GithubStoreAdapter } from './GithubStoreAdapter.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';
import { GithubInfo } from '../../domain/business/GithubInfo.js';
import { Information } from '../../domain/business/information.js';
import { Metadata } from '../../domain/business/metadata.js';
import { Origin, Type } from '../../domain/shared/enums.js';
import { Result } from '../../domain/business/Result.js';
import { Commit } from '../../domain/business/Commit.js';
import { File } from '../../domain/business/File.js';
import { PullRequest } from '../../domain/business/PullRequest.js';
import { Repository } from '../../domain/business/Repository.js';
import { Workflow } from '../../domain/business/Workflow.js';
import { WorkflowRun } from '../../domain/business/WorkflowRun.js';

describe('GithubStoreAdapter', () => {
  let adapter: GithubStoreAdapter;
  let repository: jest.Mocked<QdrantInformationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      storeInformation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubStoreAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    adapter = module.get<GithubStoreAdapter>(GithubStoreAdapter);
    repository = module.get(QdrantInformationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('storeGithubInfo', () => {
    it('should store all GitHub information successfully', async () => {
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
      
      repository.storeInformation.mockResolvedValue(Result.ok());
      
      // Act
      const result = await adapter.storeGithubInfo(githubInfo);
      
      // Assert
      expect(result.success).toBe(true);
      expect(repository.storeInformation).toHaveBeenCalledTimes(6); // 1 commit + 1 file + 1 PR + 1 repo + 1 workflow + 1 workflow run
      
      // Verify that storeInformation was called with the correct parameters for each entity
      expect(repository.storeInformation).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.any(String),
          metadata: expect.objectContaining({
            origin: Origin.GITHUB,
            type: Type.COMMIT,
            originID: expect.any(String),
          }),
        })
      );
    });
    
    it('should handle errors when storing information', async () => {
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
      
      const error = new Error('Storage error');
      repository.storeInformation.mockRejectedValue(error);
      
      // Act
      const result = await adapter.storeGithubInfo(githubInfo);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should handle empty arrays for any of the GitHub information types', async () => {
      // Arrange
      const githubInfo = new GithubInfo([], [], [], [], [], []);
      
      repository.storeInformation.mockResolvedValue(Result.ok());
      
      // Act
      const result = await adapter.storeGithubInfo(githubInfo);
      
      // Assert
      expect(result.success).toBe(true);
      expect(repository.storeInformation).not.toHaveBeenCalled();
    });
    
    it('should handle partial failure when storing information', async () => {
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
      
      // First call succeeds, second call fails
      repository.storeInformation
        .mockResolvedValueOnce(Result.ok())
        .mockRejectedValueOnce(new Error('Storage error'));
      
      // Act
      const result = await adapter.storeGithubInfo(githubInfo);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(repository.storeInformation).toHaveBeenCalledTimes(2);
    });
  });
}); 