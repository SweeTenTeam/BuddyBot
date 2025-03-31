import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { GithubAPIAdapter } from './GithubAPIAdapter.js';
import { GithubAPIFacade } from './GithubAPIFacade.js';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';
import { FileCmd } from '../../domain/command/FileCmd.js';
import { WorkflowRunCmd } from '../../domain/command/WorkflowRunCmd.js';
import { Commit } from '../../domain/business/Commit.js';
import { File } from '../../domain/business/File.js';
import { PullRequest } from '../../domain/business/PullRequest.js';
import { Repository } from '../../domain/business/Repository.js';
import { Workflow } from '../../domain/business/Workflow.js';
import { WorkflowRun } from '../../domain/business/WorkflowRun.js';
import { CommentPR } from '../../domain/business/CommentPR.js';

describe('GithubAPIAdapter', () => {
  let adapter: GithubAPIAdapter;
  let mockGithubAPI: jest.Mocked<GithubAPIFacade>;

  beforeEach(() => {
    mockGithubAPI = {
      fetchCommitsInfo: jest.fn(),
      fetchCommitModifiedFilesInfo: jest.fn(),
      fetchFileInfo: jest.fn(),
      fetchRawFileContent: jest.fn(),
      fetchPullRequestsInfo: jest.fn(),
      fetchPullRequestReviewComments: jest.fn(),
      fetchPullRequestModifiedFiles: jest.fn(),
      fetchRepositoryInfo: jest.fn(),
      fetchWorkflowsInfo: jest.fn(),
      fetchWorkflowRuns: jest.fn(),
    } as any;

    adapter = new GithubAPIAdapter(mockGithubAPI);
  });

  describe('fetchGithubCommitsInfo', () => {
    it('should fetch and transform commits correctly', async () => {
      // Mock data
      const ownerName = 'testOwner';
      const repoName = 'testRepo';
      const branchName = 'main';
      const sha = 'abc123';
      const message = 'Test commit';
      const date = '2023-01-01T00:00:00Z';
      const authorName = 'Test Author';
      
      const mockCommitResponse = {
        data: [
          {
            sha: sha,
            commit: {
              message: message,
              author: {
                name: authorName,
                date: date
              }
            }
          }
        ],
        status: 200 as const,
        headers: {},
        url: ''
      };
      
      const mockFilesResponse = {
        data: {
          files: [
            { filename: 'test1.js' },
            { filename: 'test2.js' }
          ]
        },
        status: 200 as const,
        headers: {},
        url: ''
      };
      
      mockGithubAPI.fetchCommitsInfo.mockResolvedValue(mockCommitResponse);
      mockGithubAPI.fetchCommitModifiedFilesInfo.mockResolvedValue(mockFilesResponse);
      
      // Create command
      const githubCmd = new GithubCmd();
      const repoCmd = new RepoCmd();
      repoCmd.owner = ownerName;
      repoCmd.repoName = repoName;
      repoCmd.branch_name = branchName;
      githubCmd.repoCmdList = [repoCmd];
      
      // Execute
      const result = await adapter.fetchGithubCommitsInfo(githubCmd);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Commit);
      expect(result[0].getRepoName()).toBe(repoName);
      expect(result[0].getRepoOwner()).toBe(ownerName);
      expect(result[0].getBranch()).toBe(branchName);
      expect(result[0].getHash()).toBe(sha);
      expect(result[0].getMessage()).toBe(message);
      expect(result[0].getDateOfCommit()).toBe(date);
      expect(result[0].getModifiedFiles()).toEqual(['test1.js', 'test2.js']);
      expect(result[0].getAuthor()).toBe(authorName);
      
      // Verify mocks were called correctly
      expect(mockGithubAPI.fetchCommitsInfo).toHaveBeenCalledWith(
        ownerName, repoName, branchName, githubCmd.lastUpdate
      );
      expect(mockGithubAPI.fetchCommitModifiedFilesInfo).toHaveBeenCalledWith(
        ownerName, repoName, sha
      );
    });
    
    it('should handle multiple repositories', async () => {
      // Mock data for two repositories
      mockGithubAPI.fetchCommitsInfo.mockResolvedValueOnce({
        data: [{ sha: 'sha1', commit: { message: 'Commit 1', author: { name: 'Author 1', date: '2023-01-01' } } }],
        status: 200,
        headers: {},
        url: ''
      });
      mockGithubAPI.fetchCommitModifiedFilesInfo.mockResolvedValueOnce({
        data: { files: [{ filename: 'repo1file.js' }] },
        status: 200,
        headers: {},
        url: ''
      });
      
      mockGithubAPI.fetchCommitsInfo.mockResolvedValueOnce({
        data: [{ sha: 'sha2', commit: { message: 'Commit 2', author: { name: 'Author 2', date: '2023-01-02' } } }],
        status: 200,
        headers: {},
        url: ''
      });
      mockGithubAPI.fetchCommitModifiedFilesInfo.mockResolvedValueOnce({
        data: { files: [{ filename: 'repo2file.js' }] },
        status: 200,
        headers: {},
        url: ''
      });
      
      // Create command with two repositories
      const githubCmd = new GithubCmd();
      const repoCmd1 = new RepoCmd();
      repoCmd1.owner = 'owner1';
      repoCmd1.repoName = 'repo1';
      repoCmd1.branch_name = 'main';
      
      const repoCmd2 = new RepoCmd();
      repoCmd2.owner = 'owner2';
      repoCmd2.repoName = 'repo2';
      repoCmd2.branch_name = 'develop';
      
      githubCmd.repoCmdList = [repoCmd1, repoCmd2];
      
      // Execute
      const result = await adapter.fetchGithubCommitsInfo(githubCmd);
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].getRepoName()).toBe('repo1');
      expect(result[1].getRepoName()).toBe('repo2');
    });
  });

  describe('fetchGithubFilesInfo', () => {
    it('should fetch and transform files correctly', async () => {
      // Mock data
      const path = 'src/test.js';
      const sha = 'file123';
      const repository = 'testRepo';
      const branch = 'main';
      const content = 'console.log("Hello World");';
      const encodedContent = Buffer.from(content).toString('base64');
      
      mockGithubAPI.fetchFileInfo.mockResolvedValue({
        data: {
          path: path,
          sha: sha,
          size: 1000,
          content: encodedContent
        },
        status: 200 as const,
        headers: {},
        url: ''
      });
      
      // Create command
      const fileCmd = new FileCmd();
      fileCmd.path = path;
      fileCmd.repository = repository;
      fileCmd.owner = 'testOwner';
      fileCmd.branch = branch;
      
      // Execute
      const result = await adapter.fetchGithubFilesInfo([fileCmd]);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(File);
      expect(result[0].getPath()).toBe(path);
      expect(result[0].getSha()).toBe(sha);
      expect(result[0].getRepositoryName()).toBe(repository);
      expect(result[0].getBranchName()).toBe(branch);
      expect(result[0].getContent()).toBe(content);
    });
    
    it('should handle large files using raw content', async () => {
      const path = 'src/large-file.js';
      const sha = 'largefile123';
      const repository = 'testRepo';
      const branch = 'main';
      const content = 'Large file content';
      
      mockGithubAPI.fetchFileInfo.mockResolvedValue({
        data: {
          path: path,
          sha: sha,
          size: 2000000, // 2MB (larger than 1MB threshold)
          content: '' // Not used for large files
        },
        status: 200 as const,
        headers: {},
        url: ''
      });
      
      mockGithubAPI.fetchRawFileContent.mockResolvedValue(content);
      
      // Create command
      const fileCmd = new FileCmd();
      fileCmd.path = path;
      fileCmd.repository = repository;
      fileCmd.owner = 'testOwner';
      fileCmd.branch = branch;
      
      // Execute
      const result = await adapter.fetchGithubFilesInfo([fileCmd]);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].getContent()).toBe(content);
      expect(mockGithubAPI.fetchRawFileContent).toHaveBeenCalledWith(
        'testOwner', repository, path, branch
      );
    });
    
    it('should skip binary files', async () => {
      // Create command for binary file
      const fileCmd = new FileCmd();
      fileCmd.path = 'image.png';
      fileCmd.repository = 'testRepo';
      fileCmd.owner = 'testOwner';
      fileCmd.branch = 'main';
      
      // Execute
      const result = await adapter.fetchGithubFilesInfo([fileCmd]);
      
      // Assert
      expect(result).toHaveLength(0);
      expect(mockGithubAPI.fetchFileInfo).not.toHaveBeenCalled();
    });
    
    it('should handle file not found errors gracefully', async () => {
      mockGithubAPI.fetchFileInfo.mockRejectedValue({ status: 404, message: 'Not found' });
      
      // Create command
      const fileCmd = new FileCmd();
      fileCmd.path = 'non-existent.js';
      fileCmd.repository = 'testRepo';
      fileCmd.owner = 'testOwner';
      fileCmd.branch = 'main';
      
      // Execute
      const result = await adapter.fetchGithubFilesInfo([fileCmd]);
      
      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('fetchGithubPullRequestsInfo', () => {
    it('should fetch and transform pull requests correctly', async () => {
      // Mock data
      const prId = 123;
      const prNumber = 45;
      const title = 'Test PR';
      const body = 'This is a test PR';
      const state = 'open';
      const headRef = 'feature-branch';
      const baseRef = 'main';
      const repoName = 'testRepo';
      
      mockGithubAPI.fetchPullRequestsInfo.mockResolvedValue({
        data: [
          {
            id: prId,
            number: prNumber,
            title: title,
            body: body,
            state: state,
            assignees: [{ login: 'user1' }, { login: 'user2' }],
            requested_reviewers: [{ login: 'reviewer1' }],
            head: { ref: headRef },
            base: { ref: baseRef }
          }
        ],
        status: 200,
        headers: {},
        url: ''
      });
      
      mockGithubAPI.fetchPullRequestReviewComments.mockResolvedValue({
        data: [
          {
            user: { login: 'commenter1' },
            body: 'Comment 1',
            created_at: '2023-01-01T00:00:00Z'
          }
        ],
        status: 200 as const,
        headers: {},
        url: ''
      });
      
      mockGithubAPI.fetchPullRequestModifiedFiles.mockResolvedValue([
        'file1.js', 'file2.js'
      ]);
      
      // Create command
      const githubCmd = new GithubCmd();
      const repoCmd = new RepoCmd();
      repoCmd.owner = 'testOwner';
      repoCmd.repoName = repoName;
      repoCmd.branch_name = 'main';
      githubCmd.repoCmdList = [repoCmd];
      
      // Execute
      const result = await adapter.fetchGithubPullRequestsInfo(githubCmd);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PullRequest);
      expect(result[0].getId()).toBe(prId);
      expect(result[0].getPullNumber()).toBe(prNumber);
      expect(result[0].getTitle()).toBe(title);
      expect(result[0].getDescription()).toBe(body);
      expect(result[0].getStatus()).toBe(state);
      expect(result[0].getAssignees()).toEqual(['user1', 'user2']);
      expect(result[0].getReviewers()).toEqual(['reviewer1']);
      
      const comments = result[0].getComments();
      expect(comments).toHaveLength(1);
      expect(comments[0]).toBeInstanceOf(CommentPR);
      expect(comments[0].getAuthorName()).toBe('commenter1');
      expect(comments[0].getContent()).toBe('Comment 1');
      
      expect(result[0].getModifiedFiles()).toEqual(['file1.js', 'file2.js']);
      expect(result[0].getFromBranch()).toBe(headRef);
      expect(result[0].getToBranch()).toBe(baseRef);
      expect(result[0].getRepositoryName()).toBe(repoName);
    });
  });
  
  describe('fetchGithubRepositoryInfo', () => {
    it('should fetch and transform repository info correctly', async () => {
      // Mock data
      const repoId = 12345;
      const repoName = 'testRepo';
      const createdAt = '2022-01-01T00:00:00Z';
      const updatedAt = '2023-01-01T00:00:00Z';
      const language = 'TypeScript';
      
      mockGithubAPI.fetchRepositoryInfo.mockResolvedValue({
        data: {
          id: repoId,
          name: repoName,
          created_at: createdAt,
          updated_at: updatedAt,
          language: language
        },
        status: 200,
        headers: {},
        url: ''
      });
      
      // Create command with lastUpdate date before the repo's update date
      const githubCmd = new GithubCmd();
      githubCmd.lastUpdate = new Date('2022-06-01');
      const repoCmd = new RepoCmd();
      repoCmd.owner = 'testOwner';
      repoCmd.repoName = repoName;
      repoCmd.branch_name = 'main';
      githubCmd.repoCmdList = [repoCmd];
      
      // Execute
      const result = await adapter.fetchGithubRepositoryInfo(githubCmd);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Repository);
      expect(result[0].getId()).toBe(repoId);
      expect(result[0].getName()).toBe(repoName);
      expect(result[0].getCreatedAt()).toBe(createdAt);
      expect(result[0].getLastUpdate()).toBe(updatedAt);
      expect(result[0].getMainLanguage()).toBe(language);
    });
    
    it('should filter repositories based on lastUpdate date', async () => {
      // Mock data with a repo updated before the lastUpdate threshold
      mockGithubAPI.fetchRepositoryInfo.mockResolvedValue({
        data: {
          id: 12345,
          name: 'testRepo',
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-15T00:00:00Z', // Updated before the lastUpdate
          language: 'TypeScript'
        },
        status: 200 as const,
        headers: {},
        url: ''
      });
      
      // Create command with lastUpdate date after the repo's update date
      const githubCmd = new GithubCmd();
      githubCmd.lastUpdate = new Date('2022-02-01'); // Later than the repo's update date
      const repoCmd = new RepoCmd();
      repoCmd.owner = 'testOwner';
      repoCmd.repoName = 'testRepo';
      repoCmd.branch_name = 'main';
      githubCmd.repoCmdList = [repoCmd];
      
      // Execute
      const result = await adapter.fetchGithubRepositoryInfo(githubCmd);
      
      // Assert - should be empty as the repo was updated before lastUpdate
      expect(result).toHaveLength(0);
    });
  });
  
  describe('fetchGithubWorkflowInfo', () => {
    it('should fetch and transform workflow info correctly', async () => {
      // Mock data
      const workflowId = 12345;
      const workflowName = 'CI/CD Pipeline';
      const workflowState = 'active';
      const repoName = 'testRepo';
      
      mockGithubAPI.fetchWorkflowsInfo.mockResolvedValue([
        {
          id: workflowId,
          name: workflowName,
          state: workflowState
        }
      ]);
      
      // Create command
      const githubCmd = new GithubCmd();
      const repoCmd = new RepoCmd();
      repoCmd.owner = 'testOwner';
      repoCmd.repoName = repoName;
      repoCmd.branch_name = 'main';
      githubCmd.repoCmdList = [repoCmd];
      
      // Execute
      const result = await adapter.fetchGithubWorkflowInfo(githubCmd);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Workflow);
      expect(result[0].getId()).toBe(workflowId);
      expect(result[0].getName()).toBe(workflowName);
      expect(result[0].getState()).toBe(workflowState);
      expect(result[0].getRepositoryName()).toBe(repoName);
    });
  });
  
  describe('fetchGithubWorkflowRuns', () => {
    it('should fetch and transform workflow runs correctly', async () => {
      // Mock data
      const runId = 6789;
      const status = 'completed';
      const duration = 120;
      const log = 'Build successful';
      const trigger = 'push';
      const workflowId = 12345;
      const workflowName = 'CI Pipeline';
      
      mockGithubAPI.fetchWorkflowRuns.mockResolvedValue([
        {
          id: runId,
          status: status,
          duration: duration,
          log: log,
          trigger: trigger
        }
      ]);
      
      // Create command
      const workflowRunCmd = new WorkflowRunCmd();
      workflowRunCmd.owner = 'testOwner';
      workflowRunCmd.repository = 'testRepo';
      workflowRunCmd.workflow_id = workflowId;
      workflowRunCmd.workflow_name = workflowName;
      workflowRunCmd.since_created = new Date('2023-01-01');
      
      // Execute
      const result = await adapter.fetchGithubWorkflowRuns(workflowRunCmd);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(WorkflowRun);
      expect(result[0].getId()).toBe(runId);
      expect(result[0].getStatus()).toBe(status);
      expect(result[0].getDuration()).toBe(duration);
      expect(result[0].getLog()).toBe(log);
      expect(result[0].getTrigger()).toBe(trigger);
      expect(result[0].getWorkflowId()).toBe(workflowId);
      expect(result[0].getWorkflowName()).toBe(workflowName);
    });
    
    it('should handle errors when fetching workflow runs', async () => {
      // Mock a failure
      const error = new Error('API failure');
      mockGithubAPI.fetchWorkflowRuns.mockRejectedValue(error);
      
      // Create command
      const workflowRunCmd = new WorkflowRunCmd();
      workflowRunCmd.owner = 'testOwner';
      workflowRunCmd.repository = 'testRepo';
      workflowRunCmd.workflow_id = 12345;
      
      // Assert that the error is propagated
      await expect(adapter.fetchGithubWorkflowRuns(workflowRunCmd)).rejects.toThrow(error);
    });
  });
}); 