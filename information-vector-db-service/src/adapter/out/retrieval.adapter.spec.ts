import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { RetrieveAdapter } from './retrieval.adapter.js';
import { RETRIEVAL_PORT } from '../../application/port/out/retrieval-info.port.js';
import { RetrieveCmd } from '../../domain/retreive-cmd.js';
import { InformationEntity } from './persistance/entities/information.entity.js';
import { OriginEntity, TypeEntity } from './persistance/entities/metadata.entity.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';

describe('RetrieveAdapter', () => {
  let adapter: RetrieveAdapter;
  let informationRepository: jest.Mocked<QdrantInformationRepository>;

  beforeEach(async () => {
    const mockInformationRepository = {
      retrieveRelevantInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveAdapter,
        {
          provide: QdrantInformationRepository,
          useValue: mockInformationRepository,
        },
      ],
    }).compile();

    adapter = module.get<RetrieveAdapter>(RetrieveAdapter);
    informationRepository = module.get(QdrantInformationRepository);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should retrieve information successfully', async () => {
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    
    const mockResults = [
      new InformationEntity('test content', {
        origin: OriginEntity.CONFLUENCE,
        type: TypeEntity.COMMMIT,
        originID: 'test-id'
      }),
    ];
    
    informationRepository.retrieveRelevantInfo.mockResolvedValue(mockResults);
    const result = await adapter.retrieveRelevantInfo(mockCmd);

    expect(informationRepository.retrieveRelevantInfo).toHaveBeenCalledWith(mockCmd.query);
    expect(result).toEqual(mockResults);
  });
}); 