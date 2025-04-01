import { Test, TestingModule } from '@nestjs/testing';
import { InformationController } from '../../src/adapter/in/information.controller.js';
import { GithubUseCase, GITHUB_USECASE } from '../../src/application/port/in/GithubUseCase.js';
import { JiraUseCase, JIRA_USECASE } from '../../src/application/port/in/JiraUseCase.js';
import { ConfluenceUseCase, CONFLUENCE_USECASE } from '../../src/application/port/in/ConfluenceUseCase.js';
import { FetchGithubDto } from '../../src/adapter/in/dto/FetchGithub.dto.js';
import { FetchJiraDto } from '../../src/adapter/in/dto/FetchJira.dto.js';
import { FetchConfluenceDto } from '../../src/adapter/in/dto/FetchConfluence.dto.js';
import { RepoGithubDTO } from '../../src/adapter/in/dto/RepoGithubDTO.js';
import { GithubCmd } from '../../src/domain/command/GithubCmd.js';
import { JiraCmd } from '../../src/domain/command/JiraCmd.js';
import { ConfluenceCmd } from '../../src/domain/command/ConfluenceCmd.js';
import { RepoCmd } from '../../src/domain/command/RepoCmd.js';

describe('InformationController Integration Tests', () => {
  let controller: InformationController;
  
  // Mock services
  const mockGithubService = {
    fetchAndStoreGithubInfo: jest.fn().mockResolvedValue(true)
  };
  
  const mockJiraService = {
    fetchAndStoreJiraInfo: jest.fn().mockResolvedValue(true)
  };
  
  const mockConfluenceService = {
    fetchAndStoreConfluenceInfo: jest.fn().mockResolvedValue(true)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformationController],
      providers: [
        {
          provide: GITHUB_USECASE,
          useValue: mockGithubService
        },
        {
          provide: JIRA_USECASE,
          useValue: mockJiraService
        },
        {
          provide: CONFLUENCE_USECASE,
          useValue: mockConfluenceService
        }
      ]
    }).compile();

    controller = module.get<InformationController>(InformationController);
    
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAndStoreGithubInfo', () => {
    it('should correctly transform GitHub DTO to domain command and call the use case', async () => {
      // Create test data
      const lastUpdate = new Date('2023-01-01');
      const repoDTOList = [
        new RepoGithubDTO('testOwner', 'testRepo', 'main')
      ];
      
      const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdate);
      
      // Call controller method
      const result = await controller.fetchAndStoreGithubInfo(fetchGithubDto);
      
      // Verify result
      expect(result).toBe(true);
      
      // Verify service was called with properly transformed command
      expect(mockGithubService.fetchAndStoreGithubInfo).toHaveBeenCalledTimes(1);
      
      const serviceCallArg = mockGithubService.fetchAndStoreGithubInfo.mock.calls[0][0];
      expect(serviceCallArg).toBeInstanceOf(GithubCmd);
      expect(serviceCallArg.lastUpdate).toEqual(lastUpdate);
      expect(serviceCallArg.repoCmdList.length).toBe(1);
      expect(serviceCallArg.repoCmdList[0]).toBeInstanceOf(RepoCmd);
      expect(serviceCallArg.repoCmdList[0].owner).toBe('testOwner');
      expect(serviceCallArg.repoCmdList[0].repoName).toBe('testRepo');
      expect(serviceCallArg.repoCmdList[0].branch_name).toBe('main');
    });
    
    it('should handle undefined lastUpdate in GitHub DTO', async () => {
      // Create test data without lastUpdate
      const repoDTOList = [
        new RepoGithubDTO('testOwner', 'testRepo', 'main')
      ];
      
      const fetchGithubDto = new FetchGithubDto(repoDTOList);
      
      // Call controller method
      await controller.fetchAndStoreGithubInfo(fetchGithubDto);
      
      // Verify service was called with undefined lastUpdate
      const serviceCallArg = mockGithubService.fetchAndStoreGithubInfo.mock.calls[0][0];
      expect(serviceCallArg.lastUpdate).toBeUndefined();
    });
  });

  describe('fetchAndStoreJiraInfo', () => {
    it('should correctly transform Jira DTO to domain command and call the use case', async () => {
      // Create test data
      const boardId = 123;
      const lastUpdate = new Date('2023-01-01');
      
      const fetchJiraDto = new FetchJiraDto(boardId, lastUpdate);
      
      // Call controller method
      const result = await controller.fetchAndStoreJiraInfo(fetchJiraDto);
      
      // Verify result
      expect(result).toBe(true);
      
      // Verify service was called with properly transformed command
      expect(mockJiraService.fetchAndStoreJiraInfo).toHaveBeenCalledTimes(1);
      
      const serviceCallArg = mockJiraService.fetchAndStoreJiraInfo.mock.calls[0][0];
      expect(serviceCallArg).toBeInstanceOf(JiraCmd);
      expect(serviceCallArg.boardId).toBe(boardId);
      expect(serviceCallArg.lastUpdate).toEqual(lastUpdate);
    });
    
    it('should handle undefined lastUpdate in Jira DTO', async () => {
      // Create test data with only boardId
      const boardId = 123;
      
      // Create FetchJiraDto without lastUpdate
      const fetchJiraDto = { boardId };
      
      // Call controller method
      await controller.fetchAndStoreJiraInfo(fetchJiraDto as FetchJiraDto);
      
      // Verify service was called with undefined lastUpdate
      const serviceCallArg = mockJiraService.fetchAndStoreJiraInfo.mock.calls[0][0];
      expect(serviceCallArg.boardId).toBe(boardId);
      expect(serviceCallArg.lastUpdate).toBeUndefined();
    });
  });

  describe('fetchAndStoreConfluenceInfo', () => {
    it('should correctly transform Confluence DTO to domain command and call the use case', async () => {
      // Create test data
      const lastUpdate = new Date('2023-01-01');
      
      const fetchConfluenceDto = new FetchConfluenceDto(lastUpdate);
      
      // Call controller method
      const result = await controller.fetchAndStoreConfluenceInfo(fetchConfluenceDto);
      
      // Verify result
      expect(result).toBe(true);
      
      // Verify service was called with properly transformed command
      expect(mockConfluenceService.fetchAndStoreConfluenceInfo).toHaveBeenCalledTimes(1);
      
      const serviceCallArg = mockConfluenceService.fetchAndStoreConfluenceInfo.mock.calls[0][0];
      expect(serviceCallArg).toBeInstanceOf(ConfluenceCmd);
      expect(serviceCallArg.lastUpdate).toEqual(lastUpdate);
    });
    
    it('should handle undefined lastUpdate in Confluence DTO', async () => {
      // Create test data without lastUpdate
      const fetchConfluenceDto = {} as FetchConfluenceDto;
      
      // Call controller method
      await controller.fetchAndStoreConfluenceInfo(fetchConfluenceDto);
      
      // Verify service was called with undefined lastUpdate
      const serviceCallArg = mockConfluenceService.fetchAndStoreConfluenceInfo.mock.calls[0][0];
      expect(serviceCallArg.lastUpdate).toBeUndefined();
    });
  });
}); 