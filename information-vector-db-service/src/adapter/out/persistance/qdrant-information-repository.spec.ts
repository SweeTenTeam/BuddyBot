// import { Test, TestingModule } from '@nestjs/testing';
// import { jest } from '@jest/globals';
// import { QdrantInformationRepository } from './qdrant-information-repository.js';
// import { QdrantVectorStore } from '@langchain/qdrant';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { InformationEntity } from './entities/information.entity.js';
// import { OriginEntity, TypeEntity } from './entities/metadata.entity.js';

// describe('QdrantInformationRepository', () => {
//   let repository: QdrantInformationRepository;
//   let vectorStore: jest.Mocked<QdrantVectorStore>;
//   let textSplitter: jest.Mocked<RecursiveCharacterTextSplitter>;

//   beforeEach(async () => {
//     const mockVectorStore = {
//       addDocuments: jest.fn(),
//       asRetriever: jest.fn().mockReturnValue({
//         invoke: jest.fn(),
//       }),
//       client: {
//         delete: jest.fn().mockResolvedValue(undefined as never)
//       },
//       collectionName: 'test_collection'
//     };

//     const mockTextSplitter = {
//       createDocuments: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         QdrantInformationRepository,
//         {
//           provide: QdrantVectorStore,
//           useValue: mockVectorStore,
//         },
//         {
//           provide: RecursiveCharacterTextSplitter,
//           useValue: mockTextSplitter,
//         },
//       ],
//     }).compile();

//     repository = module.get<QdrantInformationRepository>(QdrantInformationRepository);
//     vectorStore = module.get(QdrantVectorStore);
//     textSplitter = module.get(RecursiveCharacterTextSplitter);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(repository).toBeDefined();
//   });

//   it('should store information successfully', async () => {
//     const mockInfo = new InformationEntity('test content', {
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     });

//     vectorStore.addDocuments.mockResolvedValue(undefined);
//     const result = await repository.storeInformation(mockInfo);

//     expect(vectorStore.addDocuments).toHaveBeenCalled();
//     expect(result).toBe(true);
//   });

//   it('should retrieve relevant information successfully', async () => {
//     const mockQuery = 'test query';
//     const mockResults = [{
//       pageContent: 'test content',
//       metadata: {
//         origin: OriginEntity.CONFLUENCE,
//         type: TypeEntity.COMMMIT,
//         originID: 'test-id',
//       },
//     }];

//     const mockRetriever = {
//       invoke: jest.fn().mockImplementation((query: string) => Promise.resolve(mockResults)),
//     };

//     vectorStore.asRetriever.mockReturnValue(mockRetriever as any);
//     const result = await repository.retrieveRelevantInfo(mockQuery);

//     expect(result).toHaveLength(1);
//     expect(result[0].content).toBe('test content');
//     expect(result[0].metadata.origin).toBe(OriginEntity.CONFLUENCE);
//   });

//   it('should handle errors during storage', async () => {
//     const mockInfo = new InformationEntity('test content', {
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     });

//     vectorStore.addDocuments.mockRejectedValue(new Error('Storage error'));
//     const result = await repository.storeInformation(mockInfo);

//     expect(result).toBe(false);
//   });

//   it('should handle errors during retrieval', async () => {
//     const mockQuery = 'test query';
//     const mockRetriever = {
//       invoke: jest.fn().mockImplementation((query: string) => Promise.reject(new Error('Retrieval error'))),
//     };

//     vectorStore.asRetriever.mockReturnValue(mockRetriever as any);
//     const result = await repository.retrieveRelevantInfo(mockQuery);

//     expect(result).toEqual([]);
//   });

//   it('should delete existing documents before storing new ones', async () => {
//     const mockInfo = new InformationEntity('test content', {
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     });

//     // Spy on the deleteByMetadata method
//     const deleteByMetadataSpy = jest.spyOn(repository, 'deleteByMetadata');
//     deleteByMetadataSpy.mockResolvedValue(true);
    
//     vectorStore.addDocuments.mockResolvedValue(undefined);
    
//     const result = await repository.storeInformation(mockInfo);

//     // Verify that deleteByMetadata was called with the correct metadata
//     expect(deleteByMetadataSpy).toHaveBeenCalledWith({
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     });
    
//     expect(vectorStore.addDocuments).toHaveBeenCalled();
//     expect(result).toBe(true);
//   });

//   it('should successfully delete documents by metadata', async () => {
//     const metadata = {
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     };

//     const result = await repository.deleteByMetadata(metadata);

//     // Verify client.delete was called with the right parameters
//     expect(vectorStore.client.delete).toHaveBeenCalledWith('test_collection', {
//       filter: {
//         must: [
//           {
//             key: 'metadata.origin',
//             match: { value: OriginEntity.CONFLUENCE },
//           },
//           {
//             key: 'metadata.type',
//             match: { value: TypeEntity.COMMMIT },
//           },
//           {
//             key: 'metadata.originID',
//             match: { value: 'test-id' },
//           },
//         ],
//       },
//     });
    
//     expect(result).toBe(true);
//   });

//   it('should handle errors during document deletion', async () => {
//     const metadata = {
//       origin: OriginEntity.CONFLUENCE,
//       type: TypeEntity.COMMMIT,
//       originID: 'test-id',
//     };

//     // Mock client.delete to throw an error
//     vectorStore.client.delete.mockRejectedValueOnce(new Error('Deletion error'));

//     const result = await repository.deleteByMetadata(metadata);
//     expect(result).toBe(false);
//   });

//   it('should split long documents into multiple segments', async () => {
//     // Create a mock document with content longer than 1000 characters
//     const longContent = 'A'.repeat(2000);
//     const mockInfo = new InformationEntity(longContent, {
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMMIT,
//       originID: 'long-doc-id',
//     });

//     // Mock the text splitter to return multiple segments
//     const mockSplitDocs = [
//       { pageContent: 'A'.repeat(800), metadata: {} },
//       { pageContent: 'A'.repeat(800), metadata: {} },
//       { pageContent: 'A'.repeat(400), metadata: {} },
//     ];
//     textSplitter.createDocuments.mockResolvedValue(mockSplitDocs);
    
//     // Mock deleteByMetadata
//     jest.spyOn(repository, 'deleteByMetadata').mockResolvedValue(true);
    
//     // Mock addDocuments
//     vectorStore.addDocuments.mockResolvedValue(undefined);
    
//     // Store the document
//     const result = await repository.storeInformation(mockInfo);
    
//     // Verify text splitter was called
//     expect(textSplitter.createDocuments).toHaveBeenCalledWith([longContent]);
    
//     // Verify addDocuments was called with the correct number of segments
//     // and each segment has the correct metadata
//     expect(vectorStore.addDocuments).toHaveBeenCalledWith(expect.arrayContaining([
//       expect.objectContaining({
//         pageContent: expect.any(String),
//         metadata: {
//           origin: OriginEntity.GITHUB,
//           type: TypeEntity.COMMMIT,
//           originID: 'long-doc-id',
//         }
//       })
//     ]));
    
//     // The length of the array passed to addDocuments should match the number of split documents
//     const addDocumentsArgs = vectorStore.addDocuments.mock.calls[0][0];
//     expect(addDocumentsArgs.length).toBe(3);
    
//     expect(result).toBe(true);
//   });

//   it('should delete all segments of a previously split document', async () => {
//     // Create a long document that will be split
//     const longContent = 'B'.repeat(2000);
//     const mockInfo = new InformationEntity(longContent, {
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMMIT,
//       originID: 'split-doc-id',
//     });

//     // Mock the text splitter to return multiple segments
//     const mockSplitDocs = [
//       { pageContent: 'B'.repeat(800), metadata: {} },
//       { pageContent: 'B'.repeat(800), metadata: {} },
//       { pageContent: 'B'.repeat(400), metadata: {} },
//     ];
//     textSplitter.createDocuments.mockResolvedValue(mockSplitDocs);
    
//     // Create spy for deleteByMetadata to verify it's called correctly
//     const deleteByMetadataSpy = jest.spyOn(repository, 'deleteByMetadata');
//     deleteByMetadataSpy.mockResolvedValue(true);
    
//     // Store the document
//     await repository.storeInformation(mockInfo);
    
//     // Verify deleteByMetadata was called with the correct metadata
//     expect(deleteByMetadataSpy).toHaveBeenCalledWith({
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMMIT,
//       originID: 'split-doc-id',
//     });
    
//     // Reset the mocks for second test phase
//     deleteByMetadataSpy.mockReset();
//     deleteByMetadataSpy.mockResolvedValue(true);
//     vectorStore.addDocuments.mockReset();
    
//     // Now update the document with new content
//     const updatedContent = 'C'.repeat(1500);
//     const updatedInfo = new InformationEntity(updatedContent, {
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMMIT,
//       originID: 'split-doc-id',
//     });
    
//     // Mock the text splitter for updated content
//     const updatedSplitDocs = [
//       { pageContent: 'C'.repeat(750), metadata: {} },
//       { pageContent: 'C'.repeat(750), metadata: {} },
//     ];
//     textSplitter.createDocuments.mockResolvedValue(updatedSplitDocs);
    
//     // Store the updated document
//     await repository.storeInformation(updatedInfo);
    
//     // Verify deleteByMetadata was called with the same metadata
//     // This ensures all previous segments are deleted
//     expect(deleteByMetadataSpy).toHaveBeenCalledWith({
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMIT,
//       originID: 'split-doc-id',
//     });
    
//     // Verify that vectorStore.addDocuments was called with the new segments
//     expect(vectorStore.addDocuments).toHaveBeenCalled();
//     const addDocumentsArgs = vectorStore.addDocuments.mock.calls[0][0];
//     expect(addDocumentsArgs.length).toBe(2); // Should now have 2 segments instead of 3
    
//     // Verify each segment has the correct content and metadata
//     expect(addDocumentsArgs[0].pageContent).toContain('C');
//     expect(addDocumentsArgs[0].metadata).toEqual({
//       origin: OriginEntity.GITHUB,
//       type: TypeEntity.COMMIT,
//       originID: 'split-doc-id',
//     });
//   });
// }); 