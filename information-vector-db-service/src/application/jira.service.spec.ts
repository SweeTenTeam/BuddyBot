import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraService } from './jira.service.js';
import { JiraAPIPort, JIRA_API_PORT } from './port/out/JiraAPIPort.js';
import { JiraStoreInfoPort, JIRA_STORE_INFO_PORT } from './port/out/JiraStoreInfoPort.js';
import { JiraCmd } from '../domain/command/JiraCmd.js';
import { Ticket } from '../domain/business/Ticket.js';
import { Result } from '../domain/business/Result.js';
import { JiraComment } from '../domain/business/JiraComment.js';

describe('JiraService', () => {
  let jiraService: JiraService;
  let jiraApiMock: jest.Mocked<JiraAPIPort>;
  let jiraStoreMock: jest.Mocked<JiraStoreInfoPort>;

  beforeEach(async () => {
    // Create mock implementations
    jiraApiMock = {
      fetchTickets: jest.fn(),
    };

    jiraStoreMock = {
      storeTickets: jest.fn(),
    };

    // Create the test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JiraService,
        {
          provide: JIRA_API_PORT,
          useValue: jiraApiMock,
        },
        {
          provide: JIRA_STORE_INFO_PORT,
          useValue: jiraStoreMock,
        },
      ],
    }).compile();

    // Get the service instance
    jiraService = module.get<JiraService>(JiraService);
  });

  describe('fetchAndStoreJiraInfo', () => {
    it('should successfully fetch and store Jira information', async () => {
      // Arrange
      const mockTickets = [
        new Ticket(
          'JIRA-123',
          'Test Ticket',
          'Test Description',
          'John Doe',
          'In Progress',
          'Sprint 1',
          '5',
          'Jane Smith',
          'High',
          '2023-12-31',
          [new JiraComment('Test comment', 'Commenter', '2023-01-01')],
          ['JIRA-456']
        ),
      ];
      
      const jiraCmd = new JiraCmd(1, new Date());
      const expectedResult = Result.ok();
      
      // Configure mocks
      jiraApiMock.fetchTickets.mockResolvedValue(mockTickets);
      jiraStoreMock.storeTickets.mockResolvedValue(expectedResult);
      
      // Act
      const result = await jiraService.fetchAndStoreJiraInfo(jiraCmd);
      
      // Assert
      expect(jiraApiMock.fetchTickets).toHaveBeenCalledWith(jiraCmd);
      expect(jiraStoreMock.storeTickets).toHaveBeenCalledWith(mockTickets);
      expect(result).toEqual(expectedResult);
    });

    it('should handle API fetch errors gracefully', async () => {
      // Arrange
      const jiraCmd = new JiraCmd(1, new Date());
      const testError = new Error('API fetch error');
      
      // Configure mocks
      jiraApiMock.fetchTickets.mockRejectedValue(testError);
      
      // Act
      const result = await jiraService.fetchAndStoreJiraInfo(jiraCmd);
      
      // Assert
      expect(jiraApiMock.fetchTickets).toHaveBeenCalledWith(jiraCmd);
      expect(jiraStoreMock.storeTickets).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe('API fetch error');
    });

    it('should handle store errors gracefully', async () => {
      // Arrange
      const mockTickets = [
        new Ticket(
          'JIRA-123',
          'Test Ticket',
          'Test Description',
          'John Doe',
          'In Progress',
          'Sprint 1',
          '5',
          'Jane Smith',
          'High',
          '2023-12-31',
          [new JiraComment('Test comment', 'Commenter', '2023-01-01')],
          ['JIRA-456']
        ),
      ];
      
      const jiraCmd = new JiraCmd(1, new Date());
      const storeError = Result.fail('Failed to store tickets');
      
      // Configure mocks
      jiraApiMock.fetchTickets.mockResolvedValue(mockTickets);
      jiraStoreMock.storeTickets.mockResolvedValue(storeError);
      
      // Act
      const result = await jiraService.fetchAndStoreJiraInfo(jiraCmd);
      
      // Assert
      expect(jiraApiMock.fetchTickets).toHaveBeenCalledWith(jiraCmd);
      expect(jiraStoreMock.storeTickets).toHaveBeenCalledWith(mockTickets);
      expect(result).toEqual(storeError);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to store tickets');
    });
  });
}); 