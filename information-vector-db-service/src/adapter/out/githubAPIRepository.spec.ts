import { Octokit } from '@octokit/rest';
import { GithubAPIFacade } from './GithubAPIRepository.js';
import { jest } from '@jest/globals';

describe('GithubAPIFacade', () => {
  let githubAPIFacade: GithubAPIFacade;
  let mockOctokit: jest.Mocked<Octokit>;

  beforeEach(() => {
    // Create a mock Octokit instance
    mockOctokit = {
      rest: {
        repos: {
          listCommits: jest.fn(),
          getCommit: jest.fn(),
          getContent: jest.fn(),
          get: jest.fn(),
        },
        pulls: {
          list: jest.fn(),
          listFiles: jest.fn(),
        },
        actions: {
          listRepoWorkflows: jest.fn(),
          listWorkflowRuns: jest.fn(),
        },
      },
      pulls: {
        listReviewComments: jest.fn(),
      },
      request: jest.fn(),
      paginate: jest.fn(),
    } as any;

    githubAPIFacade = new GithubAPIFacade(mockOctokit);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCommitsInfo', () => {
    it('should fetch commits with default parameters', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const branch = 'main';
      
      const mockResponse = {
        data: [
          {
            sha: 'abc123',
            commit: {
              message: 'Test commit',
              author: {
                name: 'Test Author',
                date: '2023-01-01T00:00:00Z'
              }
            }
          }
        ],
        status: 200,
        headers: {},
        url: ''
      };
      
      mockOctokit.paginate.mockResolvedValue(mockResponse.data);
      
      const result = await githubAPIFacade.fetchCommitsInfo(owner, repoName, branch);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.repos.listCommits,
        {
          owner,
          repo: repoName,
          sha: branch,
          per_page: 100
        }
      );
      
      expect(result.data).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
    });
    
    it('should fetch commits with lastUpdate parameter', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const branch = 'main';
      const lastUpdate = new Date('2023-01-01');
      
      const mockResponse = {
        data: [
          {
            sha: 'abc123',
            commit: {
              message: 'Test commit',
              author: {
                name: 'Test Author',
                date: '2023-01-01T00:00:00Z'
              }
            }
          }
        ],
        status: 200,
        headers: {},
        url: ''
      };
      
      mockOctokit.paginate.mockResolvedValue(mockResponse.data);
      
      const result = await githubAPIFacade.fetchCommitsInfo(owner, repoName, branch, lastUpdate);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.repos.listCommits,
        {
          owner,
          repo: repoName,
          sha: branch,
          per_page: 100,
          since: lastUpdate.toISOString()
        }
      );
      
      expect(result.data).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching commits', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const branch = 'main';
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchCommitsInfo(owner, repoName, branch)).rejects.toThrow(error);
    });
  });

  describe('fetchCommitModifiedFilesInfo', () => {
    it('should fetch modified files for a commit', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const commitSha = 'abc123';
      
      const mockResponse = {
        data: {
          sha: commitSha,
          node_id: 'node_123',
          commit: {
            message: 'Test commit',
            author: { name: 'Test Author', date: '2023-01-01T00:00:00Z' },
            committer: { name: 'Test Committer', date: '2023-01-01T00:00:00Z' },
            tree: { sha: 'tree_sha', url: '' },
            url: '',
            comment_count: 0,
            verification: { verified: false, reason: 'unsigned', signature: null, payload: null }
          },
          url: 'https://api.github.com/repos/testOwner/testRepo/commits/abc123',
          html_url: 'https://github.com/testOwner/testRepo/commit/abc123',
          comments_url: '',
          author: { login: 'testAuthor', id: 1, node_id: 'user_node_1', avatar_url: '', gravatar_id: '', url: '', html_url: '', followers_url: '', following_url: '', gists_url: '', starred_url: '', subscriptions_url: '', organizations_url: '', repos_url: '', events_url: '', received_events_url: '', type: 'User', site_admin: false },
          committer: { login: 'testCommitter', id: 2, node_id: 'user_node_2', avatar_url: '', gravatar_id: '', url: '', html_url: '', followers_url: '', following_url: '', gists_url: '', starred_url: '', subscriptions_url: '', organizations_url: '', repos_url: '', events_url: '', received_events_url: '', type: 'User', site_admin: false },
          parents: [],
          stats: { total: 2, additions: 1, deletions: 1 },
          files: [
            { filename: 'file1.js', patch: 'diff content', sha: 'file_sha_1', status: 'modified', additions: 1, deletions: 0, changes: 1, blob_url: '', raw_url: '', contents_url: '' },
            { filename: 'file2.js', patch: 'diff content', sha: 'file_sha_2', status: 'added', additions: 1, deletions: 0, changes: 1, blob_url: '', raw_url: '', contents_url: '' }
          ]
        },
        status: 200 as const,
        headers: {},
        url: ''
      };
      
      mockOctokit.rest.repos.getCommit.mockResolvedValue(mockResponse as any);
      
      const result = await githubAPIFacade.fetchCommitModifiedFilesInfo(owner, repoName, commitSha);
      
      expect(mockOctokit.rest.repos.getCommit).toHaveBeenCalledWith({
        owner,
        repo: repoName,
        ref: commitSha,
        per_page: 100
      });
      
      expect(result.data.files).toEqual(mockResponse.data.files);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching modified files', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const commitSha = 'abc123';
      
      const error = new Error('API error');
      mockOctokit.rest.repos.getCommit.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchCommitModifiedFilesInfo(owner, repoName, commitSha)).rejects.toThrow(error);
    });
  });

  describe('fetchFileInfo', () => {
    it('should fetch file information', async () => {
      const path = 'src/test.js';
      const owner = 'testOwner';
      const repo = 'testRepo';
      const branch = 'main';
      const content = 'console.log("Hello World");';
      const encodedContent = Buffer.from(content).toString('base64');

      const mockResponse = {
        data: {
          type: 'file' as const,
          encoding: 'base64' as const,
          size: content.length,
          name: 'test.js',
          path: 'src/test.js',
          content: encodedContent,
          sha: 'file123',
          url: 'https://api.github.com/repos/testOwner/testRepo/contents/src/test.js',
          git_url: 'https://api.github.com/repos/testOwner/testRepo/git/blobs/file123',
          html_url: 'https://github.com/testOwner/testRepo/blob/main/src/test.js',
          download_url: 'https://raw.githubusercontent.com/testOwner/testRepo/main/src/test.js',
          _links: {
            self: '',
            git: '',
            html: ''
          }
        },
        status: 200 as const,
        headers: {},
        url: ''
      };
      
      mockOctokit.rest.repos.getContent.mockResolvedValue(mockResponse as any);
      
      const result = await githubAPIFacade.fetchFileInfo(path, owner, repo, branch);
      
      expect(mockOctokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner,
        repo,
        ref: branch,
        path
      });
      
      expect(result.data).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching file information', async () => {
      const path = 'src/test.js';
      const owner = 'testOwner';
      const repo = 'testRepo';
      const branch = 'main';
      
      const error = new Error('API error');
      mockOctokit.rest.repos.getContent.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchFileInfo(path, owner, repo, branch)).rejects.toThrow(error);
    });
  });

  describe('fetchRawFileContent', () => {
    it('should fetch raw file content', async () => {
      const owner = 'testOwner';
      const repo = 'testRepo';
      const path = 'src/test.js';
      const branch = 'main';
      const content = 'console.log("Hello World");';
      
      mockOctokit.request.mockResolvedValue({
        data: content,
        status: 200,
        headers: {},
        url: ''
      });
      
      const result = await githubAPIFacade.fetchRawFileContent(owner, repo, path, branch);
      
      expect(mockOctokit.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        ref: branch,
        headers: {
          accept: 'application/vnd.github.raw'
        }
      });
      
      expect(result).toBe(content);
    });
    
    it('should handle errors when fetching raw file content', async () => {
      const owner = 'testOwner';
      const repo = 'testRepo';
      const path = 'src/test.js';
      const branch = 'main';
      
      const error = new Error('API error');
      mockOctokit.request.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchRawFileContent(owner, repo, path, branch)).rejects.toThrow(error);
    });
    
    it('should throw error when response is not a string', async () => {
      const owner = 'testOwner';
      const repo = 'testRepo';
      const path = 'src/test.js';
      const branch = 'main';
      
      mockOctokit.request.mockResolvedValue({
        data: { content: 'Not a string' },
        status: 200,
        headers: {},
        url: ''
      });
      
      await expect(githubAPIFacade.fetchRawFileContent(owner, repo, path, branch)).rejects.toThrow('Expected string response for raw content');
    });
  });

  describe('fetchPullRequestsInfo', () => {
    it('should fetch pull requests', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const baseBranchName = 'main';
      
      const mockResponse = {
        data: [
          {
            id: 123,
            number: 45,
            title: 'Test PR',
            body: 'This is a test PR',
            state: 'open',
            assignees: [{ login: 'user1' }],
            requested_reviewers: [{ login: 'reviewer1' }],
            head: { ref: 'feature-branch' },
            base: { ref: 'main' }
          }
        ],
        status: 200,
        headers: {},
        url: ''
      };
      
      mockOctokit.paginate.mockResolvedValue(mockResponse.data);
      
      const result = await githubAPIFacade.fetchPullRequestsInfo(owner, repoName, baseBranchName);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.pulls.list,
        {
          owner,
          repo: repoName,
          state: 'all',
          base: baseBranchName,
          per_page: 100
        }
      );
      
      expect(result.data).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching pull requests', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const baseBranchName = 'main';
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchPullRequestsInfo(owner, repoName, baseBranchName)).rejects.toThrow(error);
    });
  });

  describe('fetchPullRequestModifiedFiles', () => {
    it('should fetch modified files for a pull request', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const pull_number = 45;
      
      const mockResponse = [
        { filename: 'file1.js' },
        { filename: 'file2.js' }
      ];
      
      mockOctokit.paginate.mockResolvedValue(mockResponse);
      
      const result = await githubAPIFacade.fetchPullRequestModifiedFiles(owner, repoName, pull_number);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.pulls.listFiles,
        {
          owner,
          repo: repoName,
          pull_number,
          per_page: 100
        }
      );
      
      expect(result).toEqual(['file1.js', 'file2.js']);
    });
    
    it('should handle errors when fetching modified files', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const pull_number = 45;
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchPullRequestModifiedFiles(owner, repoName, pull_number)).rejects.toThrow(error);
    });
  });

  describe('fetchPullRequestReviewComments', () => {
    it('should fetch review comments for a pull request', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const pull_number = 45;
      
      const mockResponse = {
        data: [
          {
            user: { login: 'commenter1' },
            body: 'Comment 1',
            created_at: '2023-01-01T00:00:00Z'
          }
        ],
        status: 200,
        headers: {},
        url: ''
      };
      
      mockOctokit.paginate.mockResolvedValue(mockResponse.data);
      
      const result = await githubAPIFacade.fetchPullRequestReviewComments(owner, repoName, pull_number);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.pulls.listReviewComments,
        {
          owner,
          repo: repoName,
          pull_number,
          per_page: 100
        }
      );
      
      expect(result.data).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching review comments', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const pull_number = 45;
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchPullRequestReviewComments(owner, repoName, pull_number)).rejects.toThrow(error);
    });
  });

  describe('fetchRepositoryInfo', () => {
    it('should fetch repository information', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      
      const mockResponse = {
        data: {
          id: 12345,
          node_id: 'repo_node_123',
          name: 'testRepo',
          full_name: 'testOwner/testRepo',
          owner: {
             login: owner, 
             id: 1, 
             node_id: 'user_node_1', 
             avatar_url: '', 
             gravatar_id: '', 
             url: '', 
             html_url: '', 
             followers_url: '', 
             following_url: '', 
             gists_url: '', 
             starred_url: '', 
             subscriptions_url: '', 
             organizations_url: '', 
             repos_url: '', 
             events_url: '', 
             received_events_url: '', 
             type: 'User', 
             site_admin: false 
          },
          private: false,
          html_url: `https://github.com/${owner}/${repoName}`,
          description: 'Test repository',
          fork: false,
          url: `https://api.github.com/repos/${owner}/${repoName}`,
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          pushed_at: '2023-01-01T00:00:00Z',
          git_url: `git://github.com/${owner}/${repoName}.git`,
          ssh_url: `git@github.com:${owner}/${repoName}.git`,
          clone_url: `https://github.com/${owner}/${repoName}.git`,
          svn_url: `https://svn.github.com/${owner}/${repoName}`,
          homepage: null,
          size: 1024,
          stargazers_count: 10,
          watchers_count: 10,
          language: 'TypeScript',
          forks_count: 2,
          open_issues_count: 1,
          default_branch: 'main',
          permissions: { admin: false, push: false, pull: true },
          allow_rebase_merge: true,
          allow_squash_merge: true,
          allow_merge_commit: true,
          allow_auto_merge: false,
          delete_branch_on_merge: false,
          allow_forking: true,
          is_template: false,
          web_commit_signoff_required: false,
          topics: [],
          archived: false,
          disabled: false,
          visibility: 'public',
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          has_discussions: false,
          forks: 2,
          open_issues: 1,
          watchers: 10,
          stargazers: 10,
          mirror_url: null,
          license: null,
          temp_clone_token: null,
          network_count: 2,
          subscribers_count: 1,
        },
        status: 200 as const,
        headers: {},
        url: `https://api.github.com/repos/${owner}/${repoName}`
      };
      
      mockOctokit.rest.repos.get.mockResolvedValue(mockResponse as any);
      
      const result = await githubAPIFacade.fetchRepositoryInfo(owner, repoName);
      
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner,
        repo: repoName
      });
      
      expect(result.data.id).toEqual(mockResponse.data.id);
      expect(result.data.name).toEqual(mockResponse.data.name);
      expect(result.data.language).toEqual(mockResponse.data.language);
      expect(result.status).toBe(200);
    });
    
    it('should handle errors when fetching repository information', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      
      const error = new Error('API error');
      mockOctokit.rest.repos.get.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchRepositoryInfo(owner, repoName)).rejects.toThrow(error);
    });
  });

  describe('fetchWorkflowsInfo', () => {
    it('should fetch workflows information', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      
      const mockResponse = [
        {
          id: 12345,
          name: 'CI/CD Pipeline',
          state: 'active'
        }
      ];
      
      mockOctokit.paginate.mockResolvedValue(mockResponse);
      
      const result = await githubAPIFacade.fetchWorkflowsInfo(owner, repoName);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.actions.listRepoWorkflows,
        {
          owner,
          repo: repoName,
          per_page: 100
        }
      );
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle errors when fetching workflows information', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchWorkflowsInfo(owner, repoName)).rejects.toThrow(error);
    });
  });

  describe('fetchWorkflowRuns', () => {
    it('should fetch workflow runs without since_created parameter', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const workflow_id = 12345;
      
      const mockResponse = [
        {
          id: 6789,
          status: 'completed',
          run_started_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:02:00Z',
          html_url: 'https://github.com/test/repo/actions/runs/6789',
          event: 'push'
        }
      ];
      
      mockOctokit.paginate.mockResolvedValue(mockResponse);
      
      const result = await githubAPIFacade.fetchWorkflowRuns(owner, repoName, workflow_id);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.actions.listWorkflowRuns,
        {
          owner,
          repo: repoName,
          workflow_id,
          per_page: 100
        }
      );
      
      expect(result).toEqual([
        {
          id: 6789,
          status: 'completed',
          duration: 120,
          log: 'https://github.com/test/repo/actions/runs/6789',
          trigger: 'push'
        }
      ]);
    });
    
    it('should fetch workflow runs with since_created parameter', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const workflow_id = 12345;
      const since_created = new Date('2023-01-01');
      
      const mockResponse = [
        {
          id: 6789,
          status: 'completed',
          run_started_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:02:00Z',
          html_url: 'https://github.com/test/repo/actions/runs/6789',
          event: 'push'
        }
      ];
      
      mockOctokit.paginate.mockResolvedValue(mockResponse);
      
      const result = await githubAPIFacade.fetchWorkflowRuns(owner, repoName, workflow_id, since_created);
      
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.actions.listWorkflowRuns,
        {
          owner,
          repo: repoName,
          workflow_id,
          per_page: 100,
          created: `>=${since_created.toISOString().split('T')[0]}`
        }
      );
      
      expect(result).toEqual([
        {
          id: 6789,
          status: 'completed',
          duration: 120,
          log: 'https://github.com/test/repo/actions/runs/6789',
          trigger: 'push'
        }
      ]);
    });
    
    it('should handle errors when fetching workflow runs', async () => {
      const owner = 'testOwner';
      const repoName = 'testRepo';
      const workflow_id = 12345;
      
      const error = new Error('API error');
      mockOctokit.paginate.mockRejectedValue(error);
      
      await expect(githubAPIFacade.fetchWorkflowRuns(owner, repoName, workflow_id)).rejects.toThrow(error);
    });
  });
}); 