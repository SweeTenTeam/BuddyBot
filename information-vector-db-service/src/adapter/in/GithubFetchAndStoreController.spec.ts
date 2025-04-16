import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { GithubFetchAndStoreController } from './GithubFetchAndStoreController.js';
import { GITHUB_USECASE, GithubUseCase } from '../../application/port/in/GithubUseCase.js';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchGithubDto } from './dto/FetchGithub.dto.js';
import { RepoGithubDTO } from './dto/RepoGithubDTO.js';

describe('GithubFetchAndStoreController', () => {
  let controller: GithubFetchAndStoreController;
  let githubService: GithubUseCase;

  const mockGithubUseCase = {
    fetchAndStoreGithubInfo: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubFetchAndStoreController],
      providers: [
        {
          provide: GITHUB_USECASE,
          useValue: mockGithubUseCase,
        },
      ],
    }).compile();

    controller = module.get<GithubFetchAndStoreController>(GithubFetchAndStoreController);
    githubService = module.get<GithubUseCase>(GITHUB_USECASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('fetchAndStore', () => {
    it('should fetch and store github info with repo list and lastUpdate', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const repoDTOList = [
        new RepoGithubDTO('testOwner', 'testRepo', 'main')
      ];
      const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdateDate);
      const mockResult = { success: true, data: { message: 'Github data stored successfully' } };
      mockGithubUseCase.fetchAndStoreGithubInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchGithubDto);

      // Assert
      expect(mockGithubUseCase.fetchAndStoreGithubInfo).toHaveBeenCalledWith(
        expect.any(GithubCmd)
      );
      expect(mockGithubUseCase.fetchAndStoreGithubInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          repoCmdList: expect.arrayContaining([
            expect.objectContaining({
              owner: 'testOwner',
              repoName: 'testRepo',
              branch_name: 'main'
            })
          ]),
          lastUpdate: expect.any(Date)
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should fetch and store github info without lastUpdate', async () => {
      // Arrange
      const repoDTOList = [
        new RepoGithubDTO('testOwner', 'testRepo', 'main')
      ];
      const fetchGithubDto = new FetchGithubDto(repoDTOList);
      const mockResult = { success: true, data: { message: 'Github data stored successfully' } };
      mockGithubUseCase.fetchAndStoreGithubInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchGithubDto);

      // Assert
      expect(mockGithubUseCase.fetchAndStoreGithubInfo).toHaveBeenCalledWith(
        expect.any(GithubCmd)
      );
      expect(mockGithubUseCase.fetchAndStoreGithubInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          repoCmdList: expect.arrayContaining([
            expect.objectContaining({
              owner: 'testOwner',
              repoName: 'testRepo',
              branch_name: 'main'
            })
          ]),
          lastUpdate: undefined
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors and return error result', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const repoDTOList = [
        new RepoGithubDTO('testOwner', 'testRepo', 'main')
      ];
      const fetchGithubDto = new FetchGithubDto(repoDTOList, lastUpdateDate);
      const error = new Error('Test error');
      mockGithubUseCase.fetchAndStoreGithubInfo.mockRejectedValue(error);
      
      const mockResultFromError = { success: false, error: error.message };
      jest.spyOn(Result, 'fromError').mockReturnValue(mockResultFromError);
      
      // Act
      const result = await controller.fetchAndStore(fetchGithubDto);
      
      // Assert
      expect(Result.fromError).toHaveBeenCalledWith(error);
      expect(result).toEqual(mockResultFromError);
    });
  });
}); 