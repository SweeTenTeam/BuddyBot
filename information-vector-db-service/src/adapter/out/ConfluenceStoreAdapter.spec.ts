import { Test, TestingModule } from '@nestjs/testing';
import { ConfluenceStoreAdapter } from './ConfluenceStoreAdapter.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';
import { ConfluenceDocument } from '../../domain/business/ConfluenceDocument.js';
import { Information } from '../../domain/business/information.js';
import { Result } from '../../domain/business/Result.js';

describe('ConfluenceStoreAdapter', () => {
  let adapter: ConfluenceStoreAdapter;
  let mockRepository: jest.Mocked<QdrantInformationRepository>;

  beforeEach(async () => {
    mockRepository = {
      storeInformation: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfluenceStoreAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    adapter = module.get<ConfluenceStoreAdapter>(ConfluenceStoreAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeDocuments', () => {
    const mockDocuments = [
      new ConfluenceDocument(
        '123', 
        'Test Page', 
        'current', 
        'John Doe', 
        'Jane Smith', 
        456, 
        '<p>Test content</p>'
      ),
    ];

    it('should successfully store all documents', async () => {
      // Arrange
      mockRepository.storeInformation.mockResolvedValue(Result.ok());

      // Act
      const result = await adapter.storeDocuments(mockDocuments);

      // Assert
      expect(result.success).toBe(true);
      expect(mockRepository.storeInformation).toHaveBeenCalledTimes(mockDocuments.length);
      expect(mockRepository.storeInformation).toHaveBeenCalledWith(
        expect.any(Information)
      );
    });

    it('should handle empty document array', async () => {
      // Act
      const result = await adapter.storeDocuments([]);

      // Assert
      expect(result.success).toBe(true);
      expect(mockRepository.storeInformation).not.toHaveBeenCalled();
    });

    it('should handle storage errors for individual documents', async () => {
      // Arrange
      mockRepository.storeInformation
        .mockResolvedValueOnce(Result.ok())
        .mockResolvedValueOnce(Result.fail('Storage error'));

      // Act
      const result = await adapter.storeDocuments([...mockDocuments, ...mockDocuments]);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockRepository.storeInformation).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors', async () => {
      // Arrange
      mockRepository.storeInformation.mockRejectedValue(new Error('Repository error'));

      // Act
      const result = await adapter.storeDocuments(mockDocuments);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockRepository.storeInformation).toHaveBeenCalledTimes(1);
    });
  });
}); 