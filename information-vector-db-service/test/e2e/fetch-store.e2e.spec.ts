import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import { GithubService } from '../../src/application/github.service.js';
import { JiraService } from '../../src/application/jira.service.js';
import { ConfluenceService } from '../../src/application/confluence.service.js';
import { GithubCmd } from '../../src/domain/command/GithubCmd.js';
import { RepoCmd } from '../../src/domain/command/RepoCmd.js';
import { JiraCmd } from '../../src/domain/command/JiraCmd.js';
import { ConfluenceCmd } from '../../src/domain/command/ConfluenceCmd.js';
import { InformationController } from '../../src/adapter/in/information.controller.js';
import { FetchGithubDto } from '../../src/adapter/in/dto/FetchGithub.dto.js';
import { FetchJiraDto } from '../../src/adapter/in/dto/FetchJira.dto.js';
import { FetchConfluenceDto } from '../../src/adapter/in/dto/FetchConfluence.dto.js';
import { RepoGithubDTO } from '../../src/adapter/in/dto/RepoGithubDTO.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
import { GITHUB_USECASE } from '../../src/application/port/in/GithubUseCase.js';
import { JIRA_USECASE } from '../../src/application/port/in/JiraUseCase.js';
import { CONFLUENCE_USECASE } from '../../src/application/port/in/ConfluenceUseCase.js';
import { Octokit } from '@octokit/rest';
import { GithubAPIFacade } from '../../src/adapter/out/GithubAPIFacade.js';
// import * as dotenv from 'dotenv';

// Load environment variables
// dotenv.config();

/**
 * IMPORTANT: This test file connects to real external services.
 * To run these tests, you need:
 * 1. Valid GitHub, Jira, and Confluence API credentials in your environment variables
 * 2. A working Qdrant database connection
 * 
 * These tests will make actual API calls and store real data.
 * 
 * Environment variables needed:
 * - GITHUB_TOKEN
 * - GITHUB_OWNER (optional, defaults to a public repo if not provided)
 * - GITHUB_REPO (optional, defaults to a public repo if not provided)
 * - JIRA_HOST
 * - JIRA_EMAIL
 * - ATLASSIAN_API_KEY
 * - JIRA_BOARD_ID
 * - CONFLUENCE_BASE_URL
 * - CONFLUENCE_USERNAME
 * - QDRANT_URL (optional, defaults to http://localhost:6333)
 * - NOMIC_API_KEY (for embeddings)
 */
describe('End-to-End Fetch and Store Tests', () => {
  let app;
  let githubService: GithubService;
  let jiraService: JiraService;
  let confluenceService: ConfluenceService;
  let informationController: InformationController;
  let qdrantRepository: QdrantInformationRepository;

  // Skip all tests if environment variables are not set
  const envCheck = () => {
    const requiredVars = [
      'GITHUB_TOKEN',
      'JIRA_HOST', 
      'JIRA_EMAIL', 
      'ATLASSIAN_API_KEY',
      'CONFLUENCE_BASE_URL',
      'CONFLUENCE_USERNAME',
      'NOMIC_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.warn(`Skipping tests due to missing environment variables: ${missingVars.join(', ')}`);
      return false;
    }
    return true;
  };
  
  const hasAllEnvVars = envCheck();

  beforeAll(async () => {
    if (!hasAllEnvVars) {
      return;
    }
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    githubService = app.get(GITHUB_USECASE);
    jiraService = app.get(JIRA_USECASE);
    confluenceService = app.get(CONFLUENCE_USECASE);
    informationController = app.get(InformationController);
    qdrantRepository = app.get(QdrantInformationRepository);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });



  describe('Jira fetch and store', () => {
    (hasAllEnvVars ? it : it.skip)('should fetch and store Jira tickets directly through service', async () => {
      // Skip if JIRA_BOARD_ID is not provided
      // if (!process.env.JIRA_BOARD_ID) {
      //   console.warn('Skipping Jira test due to missing JIRA_BOARD_ID');
      //   return;
      // }
      
      // Set up test data with time filter to limit API calls
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const boardId = 1;
      const jiraCmd = new JiraCmd(boardId, lastMonth);
      
      // Execute test
      console.log(`Fetching Jira tickets for board ${boardId}`);
      const result = await jiraService.fetchAndStoreJiraInfo(jiraCmd);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls

    (hasAllEnvVars ? it : it.skip)('should fetch and store Jira tickets through controller', async () => {
      // Skip if JIRA_BOARD_ID is not provided
      // if (!process.env.JIRA_BOARD_ID) {
      //   console.warn('Skipping Jira test due to missing JIRA_BOARD_ID');
      //   return;
      // }
      
      // Set up test data
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const boardId = 1;
      const fetchJiraDto = new FetchJiraDto(boardId, lastMonth);
      
      // Execute test
      console.log(`Fetching Jira tickets through controller for board ${boardId}`);
      const result = await informationController.fetchAndStoreJiraInfo(fetchJiraDto);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls
  });

  describe('Confluence fetch and store', () => {
    (hasAllEnvVars ? it : it.skip)('should fetch and store Confluence documents directly through service', async () => {
      // Set up test data with time filter to limit API calls
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 4);
      
      const confluenceCmd = new ConfluenceCmd(lastMonth);
      
      // Execute test
      console.log('Fetching Confluence documents');
      const result = await confluenceService.fetchAndStoreConfluenceInfo(confluenceCmd);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls

    (hasAllEnvVars ? it : it.skip)('should fetch and store Confluence documents through controller', async () => {
      // Set up test data
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 15);
      
      const fetchConfluenceDto = new FetchConfluenceDto(lastMonth);
      
      // Execute test
      console.log('Fetching Confluence documents through controller');
      const result = await informationController.fetchAndStoreConfluenceInfo(fetchConfluenceDto);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls
  });


    describe('GitHub fetch and store', () => {
    // Skip this test if environment variables are not set
    (hasAllEnvVars ? it : it.skip)('should fetch and store GitHub data directly through service', async () => {
      // Set up test data with time filter to limit API calls
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
      const repoName = process.env.GITHUB_REPO || 'Docs';
      const branch = 'develop';
      
      const repoCmd = new RepoCmd(owner, repoName, branch);
      const githubCmd = new GithubCmd([repoCmd], lastWeek);
      
      // Execute test
      console.log(`Fetching GitHub data for ${owner}/${repoName}`);
      const result = await githubService.fetchAndStoreGithubInfo(githubCmd);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls

    (hasAllEnvVars ? it : it.skip)('should fetch and store GitHub data through controller', async () => {
      // Set up test data
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
     const owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
      const repoName = process.env.GITHUB_REPO || 'Docs';
      const branch = 'master';
      
      const repoDTO = new RepoGithubDTO(owner, repoName, branch);
      const fetchGithubDto = new FetchGithubDto([repoDTO], lastWeek);
      
      // Execute test
      console.log(`Fetching GitHub data through controller for ${owner}/${repoName}`);
      const result = await informationController.fetchAndStoreGithubInfo(fetchGithubDto);
      
      // Assertions
      expect(result).toBe(true);
    }, 60000); // Increase timeout to 60 seconds for API calls
  });

  // describe('Data retrieval', () => {
  //   (hasAllEnvVars ? it : it.skip)('should retrieve stored GitHub information', async () => {
  //     // This test verifies that data was actually stored in Qdrant
  //     // and can be retrieved using metadata filters
      
  //     // Execute test
  //     console.log('Retrieving stored GitHub information');
  //     const results = await qdrantRepository.retrieveRelevantInfo('test query', 5);
      
  //     // Assertions
  //     expect(Array.isArray(results)).toBe(true);
  //     // We can't guarantee results due to timing and data availability,
  //     // but we can check that the retrieval function works without errors
  //   }, 30000); // 30 second timeout
  // });
}); 