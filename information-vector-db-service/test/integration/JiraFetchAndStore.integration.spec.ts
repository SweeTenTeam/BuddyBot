import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraService } from '../../src/application/jira.service.js';
import { JIRA_USECASE } from '../../src/application/port/in/JiraUseCase.js';
import { JiraAPIFacade } from '../../src/adapter/out/JiraAPIRepository.js';
import { JiraAPIAdapter } from '../../src/adapter/out/JiraAPIAdapter.js';
import { JiraStoreAdapter } from '../../src/adapter/out/JiraStoreAdapter.js';
import { JIRA_API_PORT } from '../../src/application/port/out/JiraAPIPort.js';
import { JIRA_STORE_INFO_PORT } from '../../src/application/port/out/JiraStoreInfoPort.js';
import { FetchJiraDto } from '../../src/adapter/in/dto/FetchJira.dto.js';
import { Result } from '../../src/domain/business/Result.js';
import { Ticket } from '../../src/domain/business/Ticket.js';
import { JiraFetchAndStoreController } from '../../src/adapter/in/JiraFetchAndStoreController.js';
import { Version3Client } from 'jira.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
import { Information } from '../../src/domain/business/information.js';

describe('Jira Integration Tests', () => {
  let controller: JiraFetchAndStoreController;
  let jiraFacade: JiraAPIFacade;
  let repository: any;
  let jiraService: JiraService;
  let testingModule: TestingModule;

  const mockJiraIssues = [
    {
      id: '10000',
      key: 'JIRA-123',
      fields: {
        summary: 'Test Issue',
        description: 'This is a test Jira issue',
        status: {
          name: 'In Progress'
        },
        created: '2023-01-01T00:00:00.000Z',
        updated: '2023-01-02T00:00:00.000Z',
        reporter: {
          displayName: 'user1'
        },
        assignee: {
          displayName: 'user2'
        }
      }
    } as any
  ];

  beforeEach(async () => {
    // Create mock implementations
    const mockJiraClient = {
      issueSearch: {
        searchForIssuesUsingJqlEnhancedSearch: jest.fn().mockImplementation(() => 
          Promise.resolve({ issues: mockJiraIssues })
        )
      }
    } as any;

    // Mock repository with storeInformation method
    repository = {
      storeInformation: jest.fn().mockImplementation(() => Promise.resolve(Result.ok()))
    };

    // Create test module with real components and mocked external dependencies
    testingModule = await Test.createTestingModule({
      controllers: [JiraFetchAndStoreController],
      providers: [
        JiraService,
        JiraAPIAdapter,
        JiraStoreAdapter,
        {
          provide: Version3Client,
          useValue: mockJiraClient
        },
        {
          provide: QdrantInformationRepository,
          useValue: repository
        },
        {
          provide: JIRA_USECASE,
          useExisting: JiraService
        },
        {
          provide: JIRA_API_PORT,
          useExisting: JiraAPIAdapter
        },
        {
          provide: JIRA_STORE_INFO_PORT,
          useExisting: JiraStoreAdapter
        },
        {
          provide: JiraAPIFacade,
          useFactory: () => {
            const facade = new JiraAPIFacade(mockJiraClient as any);
            jest.spyOn(facade, 'fetchRecentIssues').mockResolvedValue(mockJiraIssues as any);
            return facade;
          }
        }
      ]
    }).compile();

    // Get instances
    controller = testingModule.get<JiraFetchAndStoreController>(JiraFetchAndStoreController);
    jiraService = testingModule.get<JiraService>(JiraService);
    jiraFacade = testingModule.get<JiraAPIFacade>(JiraAPIFacade);
    
    // Add additional spies
    jest.spyOn(jiraService, 'fetchAndStoreJiraInfo');
    jest.spyOn(jiraFacade, 'fetchRecentIssues');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and store Jira issues through the entire flow', async () => {
    // Arrange
    const boardId = 123;
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchJiraDto = new FetchJiraDto(boardId, lastUpdateDate);
    
    // Act
    const result = await controller.fetchAndStore(fetchJiraDto);

    // Assert
    expect(jiraService.fetchAndStoreJiraInfo).toHaveBeenCalled();
    expect(jiraFacade.fetchRecentIssues).toHaveBeenCalled();
    expect(repository.storeInformation).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('should handle errors when fetching Jira data', async () => {
    // Arrange
    const boardId = 123;
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchJiraDto = new FetchJiraDto(boardId, lastUpdateDate);
    const error = new Error('Failed to fetch Jira data');
    
    // Setup mock to throw error
    jest.spyOn(jiraFacade, 'fetchRecentIssues').mockRejectedValueOnce(error);
    
    // Act
    const result = await controller.fetchAndStore(fetchJiraDto);

    // Assert
    expect(jiraService.fetchAndStoreJiraInfo).toHaveBeenCalled();
    expect(jiraFacade.fetchRecentIssues).toHaveBeenCalled();
    expect(repository.storeInformation).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch tickets: Failed to fetch Jira data');
  });

  it('should handle errors when storing Jira data', async () => {
    // Arrange
    const boardId = 123;
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchJiraDto = new FetchJiraDto(boardId, lastUpdateDate);
    const error = new Error('Failed to store Jira data');
    
    // Setup mock to throw error
    repository.storeInformation.mockRejectedValueOnce(error);
    
    // Act
    const result = await controller.fetchAndStore(fetchJiraDto);

    // Assert
    expect(jiraService.fetchAndStoreJiraInfo).toHaveBeenCalled();
    expect(jiraFacade.fetchRecentIssues).toHaveBeenCalled();
    expect(repository.storeInformation).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to store Jira data');
  });
}); 