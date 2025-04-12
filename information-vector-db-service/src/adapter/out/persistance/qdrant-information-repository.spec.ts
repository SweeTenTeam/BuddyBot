import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { QdrantInformationRepository } from './qdrant-information-repository.js';
import { QdrantVectorStore } from '@langchain/qdrant';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { InformationEntity } from './entities/information.entity.js';
import { Document } from 'langchain/document';
import { Result } from '../../../domain/business/Result.js';
import { Information } from '../../../domain/business/information.js';
import { Metadata } from '../../../domain/business/metadata.js';
import { Origin, Type } from '../../../domain/shared/enums.js';

// Define a proper type for the retriever
interface Retriever {
  invoke: (query: string) => Promise<Document[]>;
}

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
      client: {
        delete: jest.fn().mockResolvedValue(undefined as never)
      },
      collectionName: 'test_collection'
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeInformation', () => {
    it('should store information successfully', async () => {
      const info = new Information('test content', new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id'));

      const result = await repository.storeInformation(info);

      expect(vectorStore.addDocuments).toHaveBeenCalledWith([{
        pageContent: 'test content',
        metadata: {
          origin: Origin.GITHUB,
          type: Type.COMMIT,
          originID: 'test-id'
        }
      }]);
      expect(result).toBeInstanceOf(Result);
      expect(result.success).toBe(true);
    });

    it('should handle long content by splitting it', async () => {
      const longContent = 'a'.repeat(15000);
      const info = new Information(longContent, new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id'));

      const splitDocs = [
        { pageContent: 'part1', metadata: {} },
        { pageContent: 'part2', metadata: {} }
      ] as Document[];
      textSplitter.createDocuments.mockResolvedValue(splitDocs);

      const result = await repository.storeInformation(info);

      expect(textSplitter.createDocuments).toHaveBeenCalledWith([longContent]);
      expect(vectorStore.addDocuments).toHaveBeenCalledTimes(2);
      expect(vectorStore.addDocuments).toHaveBeenNthCalledWith(1, [{
        pageContent: 'part1',
        metadata: {
          origin: Origin.GITHUB,
          type: Type.COMMIT,
          originID: 'test-id'
        }
      }]);
      expect(vectorStore.addDocuments).toHaveBeenNthCalledWith(2, [{
        pageContent: 'part2',
        metadata: {
          origin: Origin.GITHUB,
          type: Type.COMMIT,
          originID: 'test-id'
        }
      }]);
      expect(result).toBeInstanceOf(Result);
      expect(result.success).toBe(true);
    });

    it('should handle errors during storage', async () => {
      const info = new Information('test content', new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id'));

      vectorStore.addDocuments.mockRejectedValue(new Error('Storage error'));

      const result = await repository.storeInformation(info);

      expect(result).toBeInstanceOf(Result);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('retrieveRelevantInfo', () => {
    it('should retrieve relevant information successfully', async () => {
      const mockDocs = [
        {
          pageContent: 'test content',
          metadata: {
            origin: Origin.GITHUB,
            type: Type.COMMIT,
            originID: 'test-id'
          }
        }
      ] as Document[];
      
      // Create a mock retriever with a properly typed invoke function
      // const mockRetriever = {
      //   invoke: function(query: string): Promise<Document[]> {
      //     return Promise.resolve(mockDocs);
      //   }
      // };
      const mockInvoke = jest.fn<(query: string) => Promise<Document[]>>();
      mockInvoke.mockImplementation((query: string) => Promise.resolve(mockDocs));

      // Use the mock function in your mockRetriever
      const mockRetriever = {
        invoke: mockInvoke
      };
      vectorStore.asRetriever.mockReturnValue(mockRetriever as any);

      const results = await repository.retrieveRelevantInfo('test query');

      expect(vectorStore.asRetriever).toHaveBeenCalledWith(30);
      expect(mockRetriever.invoke).toHaveBeenCalledWith('test query');
      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(InformationEntity);
      expect(results[0].content).toBe('test content');
      expect(results[0].metadata.origin).toBe(Origin.GITHUB);
    });

    it('should handle errors during retrieval', async () => {
      // Create a mock retriever with a properly typed invoke function that rejects
      // const mockRetriever = {
      //   invoke: function(query: string): Promise<Document[]> {
      //     return Promise.reject(new Error('Retrieval error'));
      //   }
      // };

      const mockInvoke = jest.fn() as jest.MockedFunction<(query: string) => Promise<Document[]>>;

      // Configure it to reject with an error
      mockInvoke.mockImplementation((query: string) => Promise.reject(new Error('Retrieval error')));

      // Use the mock function in your mockRetriever
      const mockRetriever = {
        invoke: mockInvoke
      };
      vectorStore.asRetriever.mockReturnValue(mockRetriever as any);

      await expect(repository.retrieveRelevantInfo('test query')).rejects.toThrow('Retrieval error');

    });
  });

  describe('splitDocuments', () => {
    it('should split documents successfully', async () => {
      const docs = [{ pageContent: 'test content' }];
      const splitDocs = [{ pageContent: 'split content', metadata: {} }] as Document[];
      textSplitter.createDocuments.mockResolvedValue(splitDocs);

      const result = await repository.splitDocuments(docs);

      expect(textSplitter.createDocuments).toHaveBeenCalledWith(['test content']);
      expect(result).toEqual(splitDocs);
    });

    it('should handle errors during splitting', async () => {
      const docs = [{ pageContent: 'test content' }];
      textSplitter.createDocuments.mockRejectedValue(new Error('Split error'));

      await expect(repository.splitDocuments(docs)).rejects.toThrow('Split error');
    });
  });

  describe('similaritySearch', () => {
    it('should perform similarity search successfully', async () => {
      const mockDocs = [
        {
          pageContent: 'test content',
          metadata: {
            origin: Origin.GITHUB,
            type: Type.COMMIT,
            originID: 'test-id'
          }
        }
      ] as Document[];
      
      // Create a mock retriever with a properly typed invoke function
      // const mockRetriever = {
      //   invoke: function(query: string): Promise<Document[]> {
      //     return Promise.resolve(mockDocs);
      //   }
      // };

       const mockInvoke = jest.fn<(query: string) => Promise<Document[]>>();
      mockInvoke.mockImplementation((query: string) => Promise.resolve(mockDocs));

      // Use the mock function in your mockRetriever
      const mockRetriever = {
        invoke: mockInvoke
      };

      
      vectorStore.asRetriever.mockReturnValue(mockRetriever as any);

      const results = await repository.similaritySearch('test query', 5);

      expect(vectorStore.asRetriever).toHaveBeenCalledWith(5);
      expect(mockRetriever.invoke).toHaveBeenCalledWith('test query');
      expect(results).toEqual(mockDocs);
    });

    it('should handle errors during similarity search', async () => {
      // Create a mock retriever with a properly typed invoke function that rejects
      // const mockRetriever = {
      //   invoke: function(query: string): Promise<Document[]> {
      //     return Promise.reject(new Error('Search error'));
      //   }
      // };

      const mockInvoke = jest.fn() as jest.MockedFunction<(query: string) => Promise<Document[]>>;

      // Configure it to reject with an error
      mockInvoke.mockImplementation((query: string) => Promise.reject(new Error('Search error')));

      // Use the mock function in your mockRetriever
      const mockRetriever = {
        invoke: mockInvoke
      };
      vectorStore.asRetriever.mockReturnValue(mockRetriever as any);

      await expect(repository.similaritySearch('test query')).rejects.toThrow('Search error');
    });
  });

  describe('deleteByMetadata', () => {
    it('should delete documents by metadata successfully', async () => {
      const metadata = new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id');

      const result = await repository.deleteByMetadata(metadata);

      expect(vectorStore.client.delete).toHaveBeenCalledWith('test_collection', {
        filter: {
          must: [
            {
              key: 'metadata.origin',
              match: { value: Origin.GITHUB }
            },
            {
              key: 'metadata.type',
              match: { value: Type.COMMIT }
            },
            {
              key: 'metadata.originID',
              match: { value: 'test-id' }
            }
          ]
        }
      });
      expect(result).toBeInstanceOf(Result);
      expect(result.success).toBe(true);
    });

    it('should handle errors during deletion', async () => {
      const metadata = new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id');

      vectorStore.client.delete.mockRejectedValue(new Error('Deletion error'));

      const result = await repository.deleteByMetadata(metadata);

      expect(result).toBeInstanceOf(Result);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
}); 