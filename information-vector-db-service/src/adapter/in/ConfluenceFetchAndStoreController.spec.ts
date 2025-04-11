import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ConfluenceFetchAndStoreController } from './ConfluenceFetchAndStoreController.js';
import { CONFLUENCE_USECASE, ConfluenceUseCase } from '../../application/port/in/ConfluenceUseCase.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchConfluenceDto } from './dto/FetchConfluence.dto.js';

describe('ConfluenceFetchAndStoreController', () => {
  let controller: ConfluenceFetchAndStoreController;
  let confluenceService: ConfluenceUseCase;

  const mockConfluenceUseCase = {
    fetchAndStoreConfluenceInfo: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfluenceFetchAndStoreController],
      providers: [
        {
          provide: CONFLUENCE_USECASE,
          useValue: mockConfluenceUseCase,
        },
      ],
    }).compile();

    controller = module.get<ConfluenceFetchAndStoreController>(ConfluenceFetchAndStoreController);
    confluenceService = module.get<ConfluenceUseCase>(CONFLUENCE_USECASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAndStore', () => {
    it('should fetch and store confluence info with lastUpdate', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
      const mockResult = { success: true, data: { message: 'Confluence data stored successfully' } };
      mockConfluenceUseCase.fetchAndStoreConfluenceInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchConfluenceDto);

      // Assert
      expect(mockConfluenceUseCase.fetchAndStoreConfluenceInfo).toHaveBeenCalledWith(
        expect.any(ConfluenceCmd)
      );
      expect(mockConfluenceUseCase.fetchAndStoreConfluenceInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          lastUpdate: expect.any(Date)
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should fetch and store confluence info without lastUpdate', async () => {
      // Arrange
      const lastUpdateDate = new Date();
      const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
      const mockResult = { success: true, data: { message: 'Confluence data stored successfully' } };
      mockConfluenceUseCase.fetchAndStoreConfluenceInfo.mockResolvedValue(mockResult);

      // Act
      const result = await controller.fetchAndStore(fetchConfluenceDto);

      // Assert
      expect(mockConfluenceUseCase.fetchAndStoreConfluenceInfo).toHaveBeenCalledWith(
        expect.any(ConfluenceCmd)
      );
      expect(mockConfluenceUseCase.fetchAndStoreConfluenceInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          lastUpdate: expect.any(Date)
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors and return error result', async () => {
      // Arrange
      const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
      const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
      const error = new Error('Test error');
      mockConfluenceUseCase.fetchAndStoreConfluenceInfo.mockRejectedValue(error);
      
      const mockResultFromError = { success: false, error: error.message };
      jest.spyOn(Result, 'fromError').mockReturnValue(mockResultFromError);
      
      // Act
      const result = await controller.fetchAndStore(fetchConfluenceDto);
      
      // Assert
      expect(Result.fromError).toHaveBeenCalledWith(error);
      expect(result).toEqual(mockResultFromError);
    });
  });
}); 