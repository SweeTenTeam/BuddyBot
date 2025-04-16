import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraFetchAndStoreController } from './JiraFetchAndStoreController.js';
import { JIRA_USECASE, JiraUseCase } from '../../application/port/in/JiraUseCase.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchJiraDto } from './dto/FetchJira.dto.js';

describe('JiraFetchAndStoreController', () => {
  let controller: JiraFetchAndStoreController;
  let jiraService: JiraUseCase;

  const mockJiraUseCase = {
    fetchAndStoreJiraInfo: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JiraFetchAndStoreController],
      providers: [
        {
          provide: JIRA_USECASE,
          useValue: mockJiraUseCase,
        },
      ],
    }).compile();

    controller = module.get<JiraFetchAndStoreController>(JiraFetchAndStoreController);
    jiraService = module.get<JiraUseCase>(JIRA_USECASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndStore', () => {
    it('should fetch and store jira info with boardId and lastUpdate', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const fetchJiraDto = new FetchJiraDto(123, lastUpdateDate);
      const mockResult = { success: true, data: { message: 'Jira data stored successfully' } };
      mockJiraUseCase.fetchAndStoreJiraInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchJiraDto);

      // Assert
      expect(mockJiraUseCase.fetchAndStoreJiraInfo).toHaveBeenCalledWith(
        expect.any(JiraCmd)
      );
      expect(mockJiraUseCase.fetchAndStoreJiraInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          boardId: 123,
          lastUpdate: expect.any(Date)
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should fetch and store jira info without lastUpdate', async () => {
      // Arrange
      const lastUpdateDate = new Date();
      const fetchJiraDto = new FetchJiraDto(123, lastUpdateDate);
      const mockResult = { success: true, data: { message: 'Jira data stored successfully' } };
      mockJiraUseCase.fetchAndStoreJiraInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchJiraDto);

      // Assert
      expect(mockJiraUseCase.fetchAndStoreJiraInfo).toHaveBeenCalledWith(
        expect.any(JiraCmd)
      );
      expect(mockJiraUseCase.fetchAndStoreJiraInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          boardId: 123,
          lastUpdate: expect.any(Date)
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors and return error result', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const fetchJiraDto = new FetchJiraDto(123, lastUpdateDate);
      const error = new Error('Test error');
      mockJiraUseCase.fetchAndStoreJiraInfo.mockRejectedValue(error);
      
      const mockResultFromError = { success: false, error: error.message };
      jest.spyOn(Result, 'fromError').mockReturnValue(mockResultFromError);
      
      // Act
      const result = await controller.fetchAndStore(fetchJiraDto);
      
      // Assert
      expect(Result.fromError).toHaveBeenCalledWith(error);
      expect(result).toEqual(mockResultFromError);
    });
  });
}); 