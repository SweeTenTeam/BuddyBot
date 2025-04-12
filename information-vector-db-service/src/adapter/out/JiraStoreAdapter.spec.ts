import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraStoreAdapter } from './JiraStoreAdapter.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';
import { Ticket } from '../../domain/business/Ticket.js';
import { JiraComment } from '../../domain/business/JiraComment.js';
import { Information } from '../../domain/business/information.js';
import { Result } from '../../domain/business/Result.js';
import { Metadata } from '../../domain/business/metadata.js';
import { Origin, Type } from '../../domain/shared/enums.js';

describe('JiraStoreAdapter', () => {
  let jiraStoreAdapter: JiraStoreAdapter;
  let repositoryMock: jest.Mocked<QdrantInformationRepository>;

  beforeEach(async () => {
    // Create mock for QdrantInformationRepository
    repositoryMock = {
      storeInformation: jest.fn(),
    } as unknown as jest.Mocked<QdrantInformationRepository>;

    // Create test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JiraStoreAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    // Get adapter instance
    jiraStoreAdapter = module.get<JiraStoreAdapter>(JiraStoreAdapter);
  });

  describe('storeTickets', () => {
    it('should store multiple tickets successfully', async () => {
      // Arrange
      const mockTickets = [
        new Ticket(
          'JIRA-123',
          'Test Ticket 1',
          'Test Description 1',
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
        new Ticket(
          'JIRA-456',
          'Test Ticket 2',
          'Test Description 2',
          'Jane Smith',
          'Done',
          'Sprint 2',
          '3',
          'John Doe',
          'Medium',
          '2023-11-30',
          [],
          ['JIRA-123']
        ),
      ];

      // Configure mocks to return success for each call
      repositoryMock.storeInformation.mockResolvedValue(Result.ok());

      // Act
      const result = await jiraStoreAdapter.storeTickets(mockTickets);

      // Assert
      expect(repositoryMock.storeInformation).toHaveBeenCalledTimes(mockTickets.length);
      
      // Verify first ticket storage
      expect(repositoryMock.storeInformation).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          content: expect.any(String), // JSON stringified content
          metadata: expect.objectContaining({
            origin: Origin.JIRA,
            type: Type.TICKET,
            originID: 'JIRA-123'
          })
        })
      );
      
      // Verify second ticket storage
      expect(repositoryMock.storeInformation).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          content: expect.any(String), // JSON stringified content
          metadata: expect.objectContaining({
            origin: Origin.JIRA,
            type: Type.TICKET,
            originID: 'JIRA-456'
          })
        })
      );
      
      // Verify result
      expect(result.success).toBe(true);
    });

    it('should handle empty ticket array gracefully', async () => {
      // Arrange
      const mockTickets: Ticket[] = [];

      // Act
      const result = await jiraStoreAdapter.storeTickets(mockTickets);

      // Assert
      expect(repositoryMock.storeInformation).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should fail and return early if storing any ticket fails', async () => {
      // Arrange
      const mockTickets = [
        new Ticket(
          'JIRA-123',
          'Test Ticket 1',
          'Test Description 1',
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
        new Ticket(
          'JIRA-456',
          'Test Ticket 2',
          'Test Description 2',
          'Jane Smith',
          'Done',
          'Sprint 2',
          '3',
          'John Doe',
          'Medium',
          '2023-11-30',
          [],
          ['JIRA-123']
        ),
      ];

      // Configure mock to succeed for first call and fail for second call
      repositoryMock.storeInformation
        .mockResolvedValueOnce(Result.ok())
        .mockResolvedValueOnce(Result.fail('Failed to store ticket'));

      // Act
      const result = await jiraStoreAdapter.storeTickets(mockTickets);

      // Assert
      expect(repositoryMock.storeInformation).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to store ticket: Failed to store ticket');
    });

    it('should handle repository throwing an error', async () => {
      // Arrange
      const mockTickets = [
        new Ticket(
          'JIRA-123',
          'Test Ticket 1',
          'Test Description 1',
          'John Doe',
          'In Progress',
          'Sprint 1',
          '5',
          'Jane Smith',
          'High',
          '2023-12-31',
          [],
          []
        ),
      ];

      // Configure mock to throw an error
      const testError = new Error('Repository error');
      repositoryMock.storeInformation.mockRejectedValue(testError);

      // Act
      const result = await jiraStoreAdapter.storeTickets(mockTickets);

      // Assert
      expect(repositoryMock.storeInformation).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Repository error');
    });
  });
}); 