import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { GithubService } from '../../src/application/github.service.js';
import { GITHUB_USECASE } from '../../src/application/port/in/GithubUseCase.js';
import { GithubAPIFacade } from '../../src/adapter/out/GithubAPIFacade.js';
import { GithubAPIAdapter } from '../../src/adapter/out/GithubAPIAdapter.js';
import { GithubStoreAdapter } from '../../src/adapter/out/GithubStoreAdapter.js';
import { GITHUB_COMMITS_API_PORT } from '../../src/application/port/out/GithubCommitAPIPort.js';
import { GITHUB_FILES_API_PORT } from '../../src/application/port/out/GithubFilesAPIPort.js';
import { GITHUB_PULL_REQUESTS_API_PORT } from '../../src/application/port/out/GithubPullRequestsAPIPort.js';
import { GITHUB_REPOSITORY_API_PORT } from '../../src/application/port/out/GithubRepositoryAPIPort.js';
import { GITHUB_WORKFLOWS_API_PORT } from '../../src/application/port/out/GithubWorkflowsAPIPort.js';
import { GITHUB_STORE_INFO_PORT } from '../../src/application/port/out/GithubStoreInfoPort.js';
import { FetchGithubDto } from '../../src/adapter/in/dto/FetchGithub.dto.js';
import { RepoGithubDTO } from '../../src/adapter/in/dto/RepoGithubDTO.js';
import { Result } from '../../src/domain/business/Result.js';
import { GithubInfo } from '../../src/domain/business/GithubInfo.js';
import { Commit } from '../../src/domain/business/Commit.js';
import { File } from '../../src/domain/business/File.js';
import { PullRequest } from '../../src/domain/business/PullRequest.js';
import { Repository } from '../../src/domain/business/Repository.js';
import { Workflow } from '../../src/domain/business/Workflow.js';
import { WorkflowRun } from '../../src/domain/business/WorkflowRun.js';
import { GithubFetchAndStoreController } from '../../src/adapter/in/GithubFetchAndStoreController.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';

describe('Github Integration Tests', () => {
  let controller: GithubFetchAndStoreController;
  let mockGithubFacade: any; // Using any to avoid TypeScript errors with mocks
  let testingModule: TestingModule;

  beforeEach(async () => {
    // Create repository mock
    const repository = {
      storeInformation: jest.fn().mockImplementation(() => {
        return Promise.resolve(Result.ok());
      })
    };

    // Create and configure GitHub API facade mock
    mockGithubFacade = {
      // Methods needed by the GithubAPIAdapter
      fetchCommitsInfo: jest.fn(),
      fetchCommitModifiedFilesInfo: jest.fn(),
      fetchFileInfo: jest.fn(),
      fetchRawFileContent: jest.fn(),
      fetchPullRequestsInfo: jest.fn(),
      fetchPullRequestReviewComments: jest.fn(),
      fetchPullRequestModifiedFiles: jest.fn(),
      fetchRepositoryInfo: jest.fn(),
      fetchWorkflowsInfo: jest.fn(),
      fetchWorkflowRuns: jest.fn()
    };

    // Setup mock responses with proper structure
    mockGithubFacade.fetchCommitsInfo.mockResolvedValue({
      data: [
        {
          sha: 'abc123',
          commit: {
            message: 'Initial commit',
            author: {
              name: 'test-user',
              date: '2023-01-01T00:00:00Z'
            }
          }
        }
      ],
      status: 200,
      headers: {},
      url: ''
    });

    mockGithubFacade.fetchCommitModifiedFilesInfo.mockResolvedValue({
      data: {
        files: [{ filename: 'README.md' }]
      },
      status: 200,
      headers: {},
      url: ''
    });

    mockGithubFacade.fetchFileInfo.mockResolvedValue({
      data: {
        path: 'README.md',
        sha: '1234567890abcdef',
        size: 100,
        content: Buffer.from('# Test Repository\nThis is a test repository.').toString('base64')
      },
      status: 200,
      headers: {},
      url: ''
    });

    mockGithubFacade.fetchPullRequestsInfo.mockResolvedValue({
      data: [
        {
          id: 1,
          number: 1,
          title: 'Test PR',
          body: 'This is a test PR',
          state: 'open',
          assignees: [],
          requested_reviewers: [],
          head: { ref: 'feature-branch' },
          base: { ref: 'main' }
        }
      ],
      status: 200,
      headers: {},
      url: ''
    });

    mockGithubFacade.fetchRepositoryInfo.mockResolvedValue({
      data: {
        id: 123,
        name: 'testrepo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        language: 'JavaScript'
      },
      status: 200,
      headers: {},
      url: ''
    });

    // These methods return different formats, adjust the mock returns accordingly
    mockGithubFacade.fetchWorkflowsInfo.mockResolvedValue([
      { id: 123, name: 'CI', state: 'active' }
    ]);

    mockGithubFacade.fetchWorkflowRuns.mockResolvedValue([
      {
        id: 1,
        status: 'success',
        duration: 120,
        log: 'Build successful',
        trigger: 'push'
      }
    ]);

    mockGithubFacade.fetchPullRequestReviewComments.mockResolvedValue({
      data: [],
      status: 200,
      headers: {},
      url: ''
    });

    mockGithubFacade.fetchPullRequestModifiedFiles.mockResolvedValue(['README.md']);

    // Create test module with real components and mocked external dependencies
    testingModule = await Test.createTestingModule({
      controllers: [GithubFetchAndStoreController],
      providers: [
        GithubService,
        GithubAPIAdapter,
        GithubStoreAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: repository
        },
        {
          provide: GITHUB_USECASE,
          useExisting: GithubService
        },
        {
          provide: GITHUB_COMMITS_API_PORT,
          useExisting: GithubAPIAdapter
        },
        {
          provide: GITHUB_FILES_API_PORT,
          useExisting: GithubAPIAdapter
        },
        {
          provide: GITHUB_PULL_REQUESTS_API_PORT,
          useExisting: GithubAPIAdapter
        },
        {
          provide: GITHUB_REPOSITORY_API_PORT,
          useExisting: GithubAPIAdapter
        },
        {
          provide: GITHUB_WORKFLOWS_API_PORT, 
          useExisting: GithubAPIAdapter
        },
        {
          provide: GITHUB_STORE_INFO_PORT,
          useExisting: GithubStoreAdapter
        },
        {
          provide: GithubAPIFacade,
          useValue: mockGithubFacade
        }
      ]
    }).compile();

    // Get controller instance
    controller = testingModule.get<GithubFetchAndStoreController>(GithubFetchAndStoreController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and store Github information successfully', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const repoDTOList = [
      new RepoGithubDTO('testowner', 'testrepo', 'main')
    ];
    const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdateDate);
    
    // Act
    const result = await controller.fetchAndStore(fetchGithubDto);
    
    // Assert
    expect(result.success).toBe(true);
    expect(mockGithubFacade.fetchCommitsInfo).toHaveBeenCalled();
    expect(mockGithubFacade.fetchRepositoryInfo).toHaveBeenCalled();
    expect(mockGithubFacade.fetchPullRequestsInfo).toHaveBeenCalled();
  });

  it('should handle errors when fetching Github data', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const repoDTOList = [
      new RepoGithubDTO('testowner', 'testrepo', 'main')
    ];
    const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdateDate);
    const error = new Error('Failed to fetch Github data');
    
    // Mock the error scenario at the facade level
    mockGithubFacade.fetchCommitsInfo.mockRejectedValueOnce(error);
    
    // Act
    const result = await controller.fetchAndStore(fetchGithubDto);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to fetch');
    expect(mockGithubFacade.fetchCommitsInfo).toHaveBeenCalled();
  });

  it('should handle errors during the GitHub workflow', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const repoDTOList = [
      new RepoGithubDTO('testowner', 'testrepo', 'main')
    ];
    const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdateDate);
    
    // Mock a scenario where repository info throws an error
    mockGithubFacade.fetchRepositoryInfo.mockImplementationOnce(() => {
      throw new Error('Repository processing error');
    });
    
    // Act
    const result = await controller.fetchAndStore(fetchGithubDto);

    // Assert
    expect(result.success).toBe(false);
    // Verify the facade method was called
    expect(mockGithubFacade.fetchCommitsInfo).toHaveBeenCalled();
  });

}); 