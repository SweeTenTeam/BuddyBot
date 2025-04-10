// import { Test, TestingModule } from '@nestjs/testing';
// import { GithubService } from '../../src/application/github.service.js';
// import { JiraService } from '../../src/application/jira.service.js';
// import { ConfluenceService } from '../../src/application/confluence.service.js';
// import { GithubCmd } from '../../src/domain/command/GithubCmd.js';
// import { RepoCmd } from '../../src/domain/command/RepoCmd.js';
// import { JiraCmd } from '../../src/domain/command/JiraCmd.js';
// import { ConfluenceCmd } from '../../src/domain/command/ConfluenceCmd.js';
// import { GITHUB_COMMITS_API_PORT } from '../../src/application/port/out/GithubCommitAPIPort.js';
// import { GITHUB_FILES_API_PORT } from '../../src/application/port/out/GithubFilesAPIPort.js';
// import { GITHUB_PULL_REQUESTS_API_PORT } from '../../src/application/port/out/GithubPullRequestsAPIPort.js';
// import { GITHUB_REPOSITORY_API_PORT } from '../../src/application/port/out/GithubRepositoryAPIPort.js';
// import { GITHUB_WORKFLOWS_API_PORT } from '../../src/application/port/out/GithubWorkflowsAPIPort.js';
// import { GITHUB_STORE_INFO_PORT } from '../../src/application/port/out/GithubStoreInfoPort.js';
// import { JIRA_API_PORT } from '../../src/application/port/out/JiraAPIPort.js';
// import { JIRA_STORE_INFO_PORT } from '../../src/application/port/out/JiraStoreInfoPort.js';
// import { CONFLUENCE_API_PORT } from '../../src/application/port/out/ConfluenceAPIPort.js';
// import { CONFLUENCE_STORE_INFO_PORT } from '../../src/application/port/out/ConfluenceStoreInfoPort.js';
// import { GithubInfo } from '../../src/domain/business/GithubInfo.js';

// // Helper function to create mocks
// function createMock(returnValue = {}) {
//   return { 
//     mockReturnValue: jest.fn().mockReturnValue(returnValue),
//     mockResolvedValue: jest.fn().mockResolvedValue(returnValue),
//     mockImplementation: jest.fn().mockImplementation(val => val)
//   };
// }

// describe('Fetch and Store Integration Tests', () => {
//   let githubService: GithubService;
//   let jiraService: JiraService;
//   let confluenceService: ConfluenceService;
  
//   // Mock repositories
//   const githubCommitsApiMock = {
//     fetchGithubCommitsInfo: jest.fn().mockResolvedValue([])
//   };
  
//   const githubFilesApiMock = {
//     fetchGithubFilesInfo: jest.fn().mockResolvedValue([])
//   };
  
//   const githubPullRequestsApiMock = {
//     fetchGithubPullRequestsInfo: jest.fn().mockResolvedValue([])
//   };
  
//   const githubRepositoryApiMock = {
//     fetchGithubRepositoryInfo: jest.fn().mockResolvedValue([])
//   };
  
//   const githubWorkflowsApiMock = {
//     fetchGithubWorkflowInfo: jest.fn().mockResolvedValue([]),
//     fetchGithubWorkflowRuns: jest.fn().mockResolvedValue([])
//   };
  
//   const githubStoreAdapterMock = {
//     storeGithubInfo: jest.fn().mockResolvedValue(true)
//   };
  
//   const jiraApiMock = {
//     fetchTickets: jest.fn().mockResolvedValue([])
//   };
  
//   const jiraStoreAdapterMock = {
//     storeTickets: jest.fn().mockResolvedValue(true)
//   };
  
//   const confluenceApiMock = {
//     fetchDocuments: jest.fn().mockResolvedValue([])
//   };
  
//   const confluenceStoreAdapterMock = {
//     storeDocuments: jest.fn().mockResolvedValue(true)
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         GithubService,
//         JiraService,
//         ConfluenceService,
//         {
//           provide: GITHUB_COMMITS_API_PORT,
//           useValue: githubCommitsApiMock
//         },
//         {
//           provide: GITHUB_FILES_API_PORT,
//           useValue: githubFilesApiMock
//         },
//         {
//           provide: GITHUB_PULL_REQUESTS_API_PORT,
//           useValue: githubPullRequestsApiMock
//         },
//         {
//           provide: GITHUB_REPOSITORY_API_PORT,
//           useValue: githubRepositoryApiMock
//         },
//         {
//           provide: GITHUB_WORKFLOWS_API_PORT,
//           useValue: githubWorkflowsApiMock
//         },
//         {
//           provide: GITHUB_STORE_INFO_PORT,
//           useValue: githubStoreAdapterMock
//         },
//         {
//           provide: JIRA_API_PORT,
//           useValue: jiraApiMock
//         },
//         {
//           provide: JIRA_STORE_INFO_PORT,
//           useValue: jiraStoreAdapterMock
//         },
//         {
//           provide: CONFLUENCE_API_PORT,
//           useValue: confluenceApiMock
//         },
//         {
//           provide: CONFLUENCE_STORE_INFO_PORT,
//           useValue: confluenceStoreAdapterMock
//         }
//       ],
//     }).compile();

//     githubService = module.get<GithubService>(GithubService);
//     jiraService = module.get<JiraService>(JiraService);
//     confluenceService = module.get<ConfluenceService>(ConfluenceService);
    
//     // Reset all mocks before each test
//     jest.clearAllMocks();
//   });

//   describe('GitHub Fetch and Store', () => {
//     it('should fetch and store GitHub information', async () => {
//       // Create test data
//       const commits = [{ getHash: () => '123' }];
//       const files = [{ getPath: () => 'file.js' }];
//       const pullRequests = [{ getId: () => 1 }];
//       const repositories = [{ getId: () => 2 }];
//       const workflows = [{ getId: () => 3 }];
//       const workflowRuns = [{ getId: () => 4 }];
      
//       // Configure mocks
//       githubCommitsApiMock.fetchGithubCommitsInfo.mockResolvedValue(commits);
//       githubFilesApiMock.fetchGithubFilesInfo.mockResolvedValue(files);
//       githubPullRequestsApiMock.fetchGithubPullRequestsInfo.mockResolvedValue(pullRequests);
//       githubRepositoryApiMock.fetchGithubRepositoryInfo.mockResolvedValue(repositories);
//       githubWorkflowsApiMock.fetchGithubWorkflowInfo.mockResolvedValue(workflows);
//       githubWorkflowsApiMock.fetchGithubWorkflowRuns.mockResolvedValue(workflowRuns);
      
//       // Create test command
//       const repoCmd = new RepoCmd('testOwner', 'testRepo', 'main');
//       const githubCmd = new GithubCmd([repoCmd]);
      
//       // Execute the fetch and store operation
//       const result = await githubService.fetchAndStoreGithubInfo(githubCmd);
      
//       // Verify the result
//       expect(result).toBe(true);
      
//       // Verify that all fetch methods were called
//       expect(githubCommitsApiMock.fetchGithubCommitsInfo).toHaveBeenCalledWith(githubCmd);
//       expect(githubPullRequestsApiMock.fetchGithubPullRequestsInfo).toHaveBeenCalledWith(githubCmd);
//       expect(githubRepositoryApiMock.fetchGithubRepositoryInfo).toHaveBeenCalledWith(githubCmd);
//       expect(githubWorkflowsApiMock.fetchGithubWorkflowInfo).toHaveBeenCalledWith(githubCmd);
      
//       // Verify that the store method was called with the correct data
//       expect(githubStoreAdapterMock.storeGithubInfo).toHaveBeenCalledTimes(1);
      
//       // Get the first argument of the first call
//       const storeArg = githubStoreAdapterMock.storeGithubInfo.mock.calls[0][0];
      
//       // Verify all properties of the GithubInfo object
//       expect(storeArg.commits).toBe(commits);
//       expect(storeArg.files).toBe(files);
//       expect(storeArg.pullRequests).toBe(pullRequests);
//       expect(storeArg.repos).toBe(repositories);
//       expect(storeArg.workflows).toBe(workflows);
//       expect(storeArg.workflow_runs).toBe(workflowRuns);
//     });
//   });

//   describe('Jira Fetch and Store', () => {
//     it('should fetch and store Jira tickets', async () => {
//       // Create mock data
//       const tickets = [{ id: 'JIRA-123' }];
      
//       // Configure mocks
//       jiraApiMock.fetchTickets.mockResolvedValue(tickets);
      
//       // Create test command
//       const jiraCmd = new JiraCmd(1, new Date('2023-01-01'));
      
//       // Execute the fetch and store operation
//       const result = await jiraService.fetchAndStoreJiraInfo(jiraCmd);
      
//       // Verify the result
//       expect(result).toBe(true);
      
//       // Verify that the fetch method was called
//       expect(jiraApiMock.fetchTickets).toHaveBeenCalledWith(jiraCmd);
      
//       // Verify that the store method was called with the correct data
//       expect(jiraStoreAdapterMock.storeTickets).toHaveBeenCalledWith(tickets);
//     });
//   });

//   describe('Confluence Fetch and Store', () => {
//     it('should fetch and store Confluence documents', async () => {
//       // Create mock data
//       const documents = [{ getId: () => 'CONF-123' }];
      
//       // Configure mocks
//       confluenceApiMock.fetchDocuments.mockResolvedValue(documents);
      
//       // Create test command
//       const confluenceCmd = new ConfluenceCmd(new Date('2023-01-01'));
      
//       // Execute the fetch and store operation
//       const result = await confluenceService.fetchAndStoreConfluenceInfo(confluenceCmd);
      
//       // Verify the result
//       expect(result).toBe(true);
      
//       // Verify that the fetch method was called
//       expect(confluenceApiMock.fetchDocuments).toHaveBeenCalledWith(confluenceCmd);
      
//       // Verify that the store method was called with the correct data
//       expect(confluenceStoreAdapterMock.storeDocuments).toHaveBeenCalledWith(documents);
//     });
//   });
// }); 