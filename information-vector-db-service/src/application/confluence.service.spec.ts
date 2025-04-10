import { Test, TestingModule } from '@nestjs/testing';
import { ConfluenceService } from './confluence.service.js';
import { ConfluenceAPIPort, CONFLUENCE_API_PORT } from './port/out/ConfluenceAPIPort.js';
import { ConfluenceStoreInfoPort, CONFLUENCE_STORE_INFO_PORT } from './port/out/ConfluenceStoreInfoPort.js';
import { ConfluenceCmd } from '../domain/command/ConfluenceCmd.js';
import { ConfluenceDocument } from '../domain/business/ConfluenceDocument.js';
import { Result } from '../domain/business/Result.js';

describe('ConfluenceService', () => {
  let service: ConfluenceService;
  let mockConfluenceAPIAdapter: jest.Mocked<ConfluenceAPIPort>;
  let mockConfluenceStoreAdapter: jest.Mocked<ConfluenceStoreInfoPort>;

  beforeEach(async () => {
    mockConfluenceAPIAdapter = {
      fetchDocuments: jest.fn(),
    } as any;

    mockConfluenceStoreAdapter = {
      storeDocuments: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfluenceService,
        {
          provide: CONFLUENCE_API_PORT,
          useValue: mockConfluenceAPIAdapter,
        },
        {
          provide: CONFLUENCE_STORE_INFO_PORT,
          useValue: mockConfluenceStoreAdapter,
        },
      ],
    }).compile();

    service = module.get<ConfluenceService>(ConfluenceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndStoreConfluenceInfo', () => {
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

    it('should successfully fetch and store documents', async () => {
      // Arrange
      const cmd = new ConfluenceCmd();
      mockConfluenceAPIAdapter.fetchDocuments.mockResolvedValue(mockDocuments);
      mockConfluenceStoreAdapter.storeDocuments.mockResolvedValue(Result.ok());

      // Act
      const result = await service.fetchAndStoreConfluenceInfo(cmd);

      // Assert
      expect(result.success).toBe(true);
      expect(mockConfluenceAPIAdapter.fetchDocuments).toHaveBeenCalledWith(cmd);
      expect(mockConfluenceStoreAdapter.storeDocuments).toHaveBeenCalledWith(mockDocuments);
    });

    it('should handle API fetch errors', async () => {
      // Arrange
      const cmd = new ConfluenceCmd();
      const error = new Error('API Error');
      mockConfluenceAPIAdapter.fetchDocuments.mockRejectedValue(error);

      // Act
      const result = await service.fetchAndStoreConfluenceInfo(cmd);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockConfluenceStoreAdapter.storeDocuments).not.toHaveBeenCalled();
    });

    it('should handle storage errors', async () => {
      // Arrange
      const cmd = new ConfluenceCmd();
      mockConfluenceAPIAdapter.fetchDocuments.mockResolvedValue(mockDocuments);
      mockConfluenceStoreAdapter.storeDocuments.mockResolvedValue(Result.fail('Storage error'));

      // Act
      const result = await service.fetchAndStoreConfluenceInfo(cmd);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockConfluenceAPIAdapter.fetchDocuments).toHaveBeenCalledWith(cmd);
      expect(mockConfluenceStoreAdapter.storeDocuments).toHaveBeenCalledWith(mockDocuments);
    });
  });
}); 