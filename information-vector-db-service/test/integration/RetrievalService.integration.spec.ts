import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { AppModule } from '../../src/app.module.js';

import { RETRIEVAL_USE_CASE } from '../../src/application/port/in/retrieval-usecase.port.js';
import { RETRIEVAL_PORT } from '../../src/application/port/out/retrieval-info.port.js';
import { Information } from '../../src/domain/business/information.js';
import { Metadata } from '../../src/domain/business/metadata.js';
import { Origin, Type } from '../../src/domain/shared/enums.js';
import { RetrieveCmd } from '../../src/domain/command/retreive-cmd.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
import { RetrieveAdapter } from '../../src/adapter/out/retrieval.adapter.js';

describe('Retrieval Integration Tests', () => {
  let moduleRef: TestingModule;
  let retrievalService: any;
  let retrievalPortMock: any;

  // Mock data
  const mockInformation = [
    new Information(
      'Test content 1',
      new Metadata(Origin.GITHUB, Type.COMMIT, 'commit-123')
    ),
    new Information(
      'Test content 2',
      new Metadata(Origin.JIRA, Type.TICKET, 'ticket-456')
    ),
    new Information(
      'Test content 3',
      new Metadata(Origin.CONFLUENCE, Type.DOCUMENT, 'page-789')
    )
  ];

  beforeAll(async () => {
    // Create a mock QdrantInformationRepository implementation
    const mockQdrantRepository = {
      retrieveRelevantInfo: jest.fn().mockImplementation((query: string) => {
        if (query === 'error query') {
          return Promise.reject(new Error('Failed to retrieve information'));
        }
        
        // Return entities that match the QdrantInformationRepository's return type
        return Promise.resolve(mockInformation.map(info => ({
          content: info.content,
          metadata: {
            origin: info.metadata.origin,
            type: info.metadata.type,
            originID: info.metadata.originID
          }
        })));
      })
    };

    // Create test module with the mock repository
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QdrantInformationRepository)
      .useValue(mockQdrantRepository)
      .compile();

    // Get the service and port
    retrievalService = moduleRef.get(RETRIEVAL_USE_CASE);
    const retrievalPort = moduleRef.get(RETRIEVAL_PORT);

    // Set up the spy on the port
    retrievalPortMock = jest.spyOn(retrievalPort, 'retrieveRelevantInfo');
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve information when called directly', async () => {
    // Arrange
    const retrieveCmd = new RetrieveCmd();
    retrieveCmd.query = 'test query';
    
    // Act
    const result = await retrievalService.retrieveRelevantInfo(retrieveCmd);

    // Assert
    expect(retrievalPortMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'test query'
      })
    );
    
    // Check result format
    expect(result).toHaveLength(3);
    expect(result[0].content).toBe('Test content 1');
    expect(result[0].metadata.origin).toBe(Origin.GITHUB);
    expect(result[0].metadata.type).toBe(Type.COMMIT);
    expect(result[0].metadata.originID).toBe('commit-123');
  });

  it('should handle errors during information retrieval', async () => {
    // Arrange
    const retrieveCmd = new RetrieveCmd();
    retrieveCmd.query = 'error query';
    
    // Act & Assert
    await expect(
      retrievalService.retrieveRelevantInfo(retrieveCmd)
    ).rejects.toThrow('Failed to retrieve information');

    expect(retrievalPortMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'error query'
      })
    );
  });
}); 