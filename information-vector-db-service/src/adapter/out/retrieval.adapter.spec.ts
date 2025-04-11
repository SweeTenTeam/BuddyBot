import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { RetrieveAdapter } from './retrieval.adapter.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';
import { RetrieveCmd } from '../../domain/command/retreive-cmd.js';
import { InformationEntity } from './persistance/entities/information.entity.js';
import { Information } from '../../domain/business/information.js';
import { Metadata } from '../../domain/business/metadata.js';
import { Origin, Type } from '../../domain/shared/enums.js';


describe('RetrieveAdapter', () => {
  let adapter: RetrieveAdapter;
  let repository: jest.Mocked<QdrantInformationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      retrieveRelevantInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    adapter = module.get<RetrieveAdapter>(RetrieveAdapter);
    repository = module.get(QdrantInformationRepository);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should convert repository entities to domain information', async () => {
    // Arrange
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    
    const mockEntities = [
      new InformationEntity('test content', {
        origin: Origin.GITHUB,
        type: Type.COMMIT,
        originID: 'test-id'
      })
    ];
    
    const expectedInfo = [
      new Information('test content', new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id'))
    ];

    repository.retrieveRelevantInfo.mockResolvedValue(mockEntities);

    // Act
    const result = await adapter.retrieveRelevantInfo(mockCmd);

    // Assert
    expect(repository.retrieveRelevantInfo).toHaveBeenCalledWith(mockCmd.query);
    expect(result).toEqual(expectedInfo);
  });

  it('should handle empty results', async () => {
    // Arrange
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    repository.retrieveRelevantInfo.mockResolvedValue([]);

    // Act
    const result = await adapter.retrieveRelevantInfo(mockCmd);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle errors thrown by the repository', async () => {
    // Arrange
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    const errorMessage = 'Test error';
    repository.retrieveRelevantInfo.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(adapter.retrieveRelevantInfo(mockCmd)).rejects.toThrow(errorMessage);
  });
}); 