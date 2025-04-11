import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ConfluenceService } from '../../src/application/confluence.service.js';
import { CONFLUENCE_USECASE } from '../../src/application/port/in/ConfluenceUseCase.js';
import { ConfluenceAPIFacade } from '../../src/adapter/out/ConfluenceAPIFacade.js';
import { ConfluenceAPIAdapter } from '../../src/adapter/out/ConfluenceAPIAdapter.js';
import { ConfluenceStoreAdapter } from '../../src/adapter/out/ConfluenceStoreAdapter.js';
import { CONFLUENCE_API_PORT } from '../../src/application/port/out/ConfluenceAPIPort.js';
import { CONFLUENCE_STORE_INFO_PORT } from '../../src/application/port/out/ConfluenceStoreInfoPort.js';
import { FetchConfluenceDto } from '../../src/adapter/in/dto/FetchConfluence.dto.js';
import { Result } from '../../src/domain/business/Result.js';
import { ConfluenceDocument } from '../../src/domain/business/ConfluenceDocument.js';
import { ConfluenceFetchAndStoreController } from '../../src/adapter/in/ConfluenceFetchAndStoreController.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
import { Information } from '../../src/domain/business/information.js';

describe('Confluence Integration Tests', () => {
  let controller: ConfluenceFetchAndStoreController;
  let confluenceFacade: ConfluenceAPIFacade;
  let repository: any;
  let confluenceService: ConfluenceService;
  let testingModule: TestingModule;
  let confluenceApiSpy: any;

  const mockConfluenceDocuments = [
    new ConfluenceDocument(
      '12345',
      'Test Page',
      'current',
      'Test User',
      'Test Owner',
      12345,
      'This is a test confluence page content'
    )
  ];

  const mockConfluenceApiResponse = {
    results: [
      {
        id: '12345',
        title: 'Test Page',
        status: 'current',
        version: { number: 1 },
        creator: { displayName: 'Test User' },
        _links: { webui: '/pages/12345' },
        body: { storage: { value: 'This is a test confluence page content' } }
      }
    ]
  };

  beforeEach(async () => {
    // Create mock implementations
    const mockConfluenceClient = {
      content: {
        getContent: jest.fn().mockImplementation(() => 
          Promise.resolve(mockConfluenceApiResponse)
        )
      }
    } as any;

    // Mock repository with storeInformation method
    repository = {
      storeInformation: jest.fn().mockImplementation(() => Promise.resolve(Result.ok()))
    };

    // Create test module with real components and mocked external dependencies
    testingModule = await Test.createTestingModule({
      controllers: [ConfluenceFetchAndStoreController],
      providers: [
        ConfluenceService,
        ConfluenceAPIAdapter,
        ConfluenceStoreAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: repository
        },
        {
          provide: CONFLUENCE_USECASE,
          useExisting: ConfluenceService
        },
        {
          provide: CONFLUENCE_API_PORT,
          useExisting: ConfluenceAPIAdapter
        },
        {
          provide: CONFLUENCE_STORE_INFO_PORT,
          useExisting: ConfluenceStoreAdapter
        },
        {
          provide: ConfluenceAPIFacade,
          useFactory: () => {
            const facade = new ConfluenceAPIFacade('https://example.com', 'username', 'password');
            confluenceApiSpy = jest.spyOn(facade, 'fetchConfluencePages');
            confluenceApiSpy.mockImplementation(() => Promise.resolve(mockConfluenceApiResponse));
            return facade;
          }
        }
      ]
    }).compile();

    // Get instances
    controller = testingModule.get<ConfluenceFetchAndStoreController>(ConfluenceFetchAndStoreController);
    confluenceService = testingModule.get<ConfluenceService>(ConfluenceService);
    confluenceFacade = testingModule.get<ConfluenceAPIFacade>(ConfluenceAPIFacade);
    
    // Add additional spies
    jest.spyOn(confluenceService, 'fetchAndStoreConfluenceInfo');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and store Confluence documents through the entire flow', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
    
    // Act
    const result = await controller.fetchAndStore(fetchConfluenceDto);

    // Assert
    expect(confluenceService.fetchAndStoreConfluenceInfo).toHaveBeenCalled();
    expect(confluenceApiSpy).toHaveBeenCalled();
    expect(repository.storeInformation).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('should handle errors when fetching Confluence data', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
    const error = new Error('Failed to fetch Confluence data');
    
    // Setup mock to throw error
    confluenceApiSpy.mockRejectedValueOnce(error);
    
    // Act
    const result = await controller.fetchAndStore(fetchConfluenceDto);

    // Assert
    expect(confluenceService.fetchAndStoreConfluenceInfo).toHaveBeenCalled();
    expect(confluenceApiSpy).toHaveBeenCalled();
    expect(repository.storeInformation).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch Confluence data');
  });

  it('should handle errors when storing Confluence data', async () => {
    // Arrange
    const lastUpdateDate = new Date('2023-01-01T00:00:00Z');
    const fetchConfluenceDto = new FetchConfluenceDto(lastUpdateDate);
    const error = new Error('Failed to store Confluence data');
    
    // Setup mock to throw error
    repository.storeInformation.mockRejectedValueOnce(error);
    
    // Act
    const result = await controller.fetchAndStore(fetchConfluenceDto);

    // Assert
    expect(confluenceService.fetchAndStoreConfluenceInfo).toHaveBeenCalled();
    expect(confluenceApiSpy).toHaveBeenCalled();
    expect(repository.storeInformation).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to store Confluence data');
  });
}); 