import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { QdrantInformationRepository } from './qdrant-information-repository.js';
import { QdrantVectorStore } from '@langchain/qdrant';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { InformationEntity } from './entities/information.entity.js';
import { OriginEntity, TypeEntity } from './entities/metadata.entity.js';

describe('QdrantInformationRepository', () => {
  let repository: QdrantInformationRepository;
  let vectorStore: jest.Mocked<QdrantVectorStore>;
  let textSplitter: jest.Mocked<RecursiveCharacterTextSplitter>;

  beforeEach(async () => {
    const mockVectorStore = {
      addDocuments: jest.fn(),
      asRetriever: jest.fn().mockReturnValue({
        invoke: jest.fn(),
      }),
    };

    const mockTextSplitter = {
      createDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QdrantInformationRepository,
        {
          provide: QdrantVectorStore,
          useValue: mockVectorStore,
        },
        {
          provide: RecursiveCharacterTextSplitter,
          useValue: mockTextSplitter,
        },
      ],
    }).compile();

    repository = module.get<QdrantInformationRepository>(QdrantInformationRepository);
    vectorStore = module.get(QdrantVectorStore);
    textSplitter = module.get(RecursiveCharacterTextSplitter);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should store information successfully', async () => {
    const mockInfo = new InformationEntity('test content', {
      origin: OriginEntity.CONFLUENCE,
      type: TypeEntity.COMMMIT,
      originID: 'test-id',
    });

    vectorStore.addDocuments.mockResolvedValue(undefined);
    const result = await repository.storeInformation(mockInfo);

    expect(vectorStore.addDocuments).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should retrieve relevant information successfully', async () => {
    const mockQuery = 'test query';
    const mockResults = [{
      pageContent: 'test content',
      metadata: {
        origin: OriginEntity.CONFLUENCE,
        type: TypeEntity.COMMMIT,
        originID: 'test-id',
      },
    }];

    const mockRetriever = {
      invoke: jest.fn().mockImplementation((query: string) => Promise.resolve(mockResults)),
    };

    vectorStore.asRetriever.mockReturnValue(mockRetriever as any);
    const result = await repository.retrieveRelevantInfo(mockQuery);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('test content');
    expect(result[0].metadata.origin).toBe(OriginEntity.CONFLUENCE);
  });

  it('should handle errors during storage', async () => {
    const mockInfo = new InformationEntity('test content', {
      origin: OriginEntity.CONFLUENCE,
      type: TypeEntity.COMMMIT,
      originID: 'test-id',
    });

    vectorStore.addDocuments.mockRejectedValue(new Error('Storage error'));
    const result = await repository.storeInformation(mockInfo);

    expect(result).toBe(false);
  });

  it('should handle errors during retrieval', async () => {
    const mockQuery = 'test query';
    const mockRetriever = {
      invoke: jest.fn().mockImplementation((query: string) => Promise.reject(new Error('Retrieval error'))),
    };

    vectorStore.asRetriever.mockReturnValue(mockRetriever as any);
    const result = await repository.retrieveRelevantInfo(mockQuery);

    expect(result).toEqual([]);
  });
}); 