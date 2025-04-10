// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import request from 'supertest';
// import { QdrantVectorStore } from '@langchain/qdrant';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { RetrievalController } from '../../src/adapter/in/retrieval.controller.js';
// import { RetrievalService } from '../../src/application/retrieval.service.js';
// import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
// import { RetrieveAdapter } from '../../src/adapter/out/retrieval.adapter.js';
// import { RETRIEVAL_PORT } from '../../src/application/port/out/retrieval-info.port.js';
// import { RETRIEVAL_USE_CASE } from '../../src/application/port/in/retrieval-usecase.port.js';
// import { Metadata, Origin, Type } from '../../src/domain/business/metadata.js';
// import { InformationEntity } from '../../src/adapter/out/persistance/entities/information.entity.js';
// import { OriginEntity, TypeEntity } from '../../src/adapter/out/persistance/entities/metadata.entity.js';
// import { QdrantClient } from '@qdrant/js-client-rest';
// import { NomicEmbeddings } from '@langchain/nomic';
// import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';
// import { Information } from 'src/domain/business/information.js';



// describe('Retrieval Integration', () => {
//   let app: INestApplication;
//   let qdrantClient: QdrantClient;
//   let vectorStore: QdrantVectorStore;
//   let repository: QdrantInformationRepository;
//   let rabbitClient: ClientProxy;
  
//   const COLLECTION_NAME = 'buddybot_info';

//   beforeAll(async () => {
//     const qdrantUrl = process.env.QDRANT_URL || 'http://qdrant';
//     console.log(`Connecting to Qdrant at: ${qdrantUrl}`);
    
//     qdrantClient = new QdrantClient({
//       url: qdrantUrl,
//     });

//     try {
//       await qdrantClient.deleteCollection(COLLECTION_NAME);
//     } catch (e) {

//     }

//     await qdrantClient.createCollection(COLLECTION_NAME, {
//       vectors: {
//         size: 768,
//         distance: 'Cosine',
//       },
//     });

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [
//         ClientsModule.register([
//           {
//             name: 'RABBIT_SERVICE',
//             transport: Transport.RMQ,
//             options: {
//               urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq'],
//               queue: 'information-queue',
//               queueOptions: {
//                 durable: true,
//               },
//             },
//           },
//         ]),
//       ],
//       controllers: [RetrievalController],
//       providers: [
//         {
//           provide: QdrantVectorStore,
//           useFactory: async () => {
//             const embeddings = new NomicEmbeddings();
//             const vectorStore = new QdrantVectorStore(embeddings, {
//               client: new QdrantClient({ url: qdrantUrl }),
//               collectionName: COLLECTION_NAME,
//             });
//             return vectorStore;
//           },
//         },
//         {
//           provide: RecursiveCharacterTextSplitter,
//           useFactory: () => {
//             return new RecursiveCharacterTextSplitter({
//               chunkSize: 768,
//             });
//           },
//         },
//         QdrantInformationRepository,
//         RetrieveAdapter,
//         {
//           provide: RETRIEVAL_PORT,
//           useExisting: RetrieveAdapter,
//         },
//         RetrievalService,
//         {
//           provide: RETRIEVAL_USE_CASE,
//           useExisting: RetrievalService,
//         },
//       ],
//     }).compile();

//     app = moduleFixture.createNestApplication();
    
//     app.connectMicroservice({
//       transport: Transport.RMQ,
//       options: {
//         urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq'],
//         queue: 'information-queue',
//         queueOptions: {
//           durable: true,
//         },
//       },
//     });
    
//     vectorStore = moduleFixture.get<QdrantVectorStore>(QdrantVectorStore);
//     repository = moduleFixture.get<QdrantInformationRepository>(QdrantInformationRepository);
//     rabbitClient = moduleFixture.get('RABBIT_SERVICE');
    
//     await app.startAllMicroservices();
//     await app.init();
    
//     await rabbitClient.connect();
//   });

//   afterAll(async () => {
//     try {
//       await qdrantClient.deleteCollection(COLLECTION_NAME);
//     } catch (e) {
//       console.error('Error cleaning up test collection:', e);
//     }
    
//     await rabbitClient.close();
    
//     await app.close();
//   });

//   it('should store and retrieve information through RabbitMQ messaging', async () => {
//     const testInfo = new Information(
//       'This is a test document about information retrieval systems and vector databases',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'real-test-id',
//       }
//     );

//     const storeResult = await repository.storeInformation(testInfo);
//     expect(storeResult).toBe(true);
    
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const response = await lastValueFrom(
//       rabbitClient.send('retrieve.information', { query: 'information retrieval' })
//     );

//     console.log(JSON.stringify(response));
      
//     expect(response.length).toBeGreaterThan(0);
    
//     const testDocument = response.find(doc => doc.metadata.originID === 'real-test-id');
//     expect(testDocument).toBeDefined();
//     expect(testDocument.content).toContain('information retrieval');
//     expect(testDocument.metadata.origin).toBe(Origin.GITHUB);
//     expect(testDocument.metadata.type).toBe(Type.COMMIT);
//   });

//   it('should store multiple documents and retrieve the most relevant ones using RabbitMQ', async () => {
//   const testDocuments = [
//     new Information(
//       'TypeScript is a strongly typed programming language that builds on JavaScript',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'typescript-doc',
//       }
//     ),
//     new Information(
//       'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'nodejs-doc',
//       }
//     ),
//     new Information(
//       'NestJS is a framework for building efficient, scalable Node.js server-side applications',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'nestjs-doc',
//       }
//     ),
//   ];
  
//   for (const doc of testDocuments) {
//     await repository.storeInformation(doc);
//   }
  
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   const tsResponse = await lastValueFrom(
//     rabbitClient.send('retrieve.information', { query: 'typed programming language' })
//   );
    
//   // const tsDocument = tsResponse.find(doc => doc.metadata.originID === 'typescript-doc');
//   // expect(tsDocument).toBeDefined();
//   expect(tsResponse[0].metadata.originID ==='typescript-doc')
  
//   const nodeResponse = await lastValueFrom(
//     rabbitClient.send('retrieve.information', { query: 'javascript runtime' })
//   );
    
//   // const nodeDocument = nodeResponse.find(doc => doc.metadata.originID === 'nodejs-doc');
//   // expect(nodeDocument).toBeDefined();
//   expect(nodeResponse[0].metadata.originID ==='nodejs-doc')
// });

//   it('should replace document content when storing with same metadata and retrieve via RabbitMQ', async () => {
//     const originalDoc = new Information(
//       'Original document that will be replaced',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'replacement-test-id',
//       }
//     );

//     await repository.storeInformation(originalDoc);
    
//     // await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const originalResponse = await lastValueFrom(
//       rabbitClient.send('retrieve.information', { query: 'original document replaced' })
//     );
    
//     const originalDocument = originalResponse.find(doc => doc.metadata.originID === 'replacement-test-id');
//     expect(originalDocument).toBeDefined();
//     expect(originalDocument.content).toBe('Original document that will be replaced');
    
//     const updatedDoc = new Information(
//       'Updated document that replaces the original',
//       {
//         origin: Origin.GITHUB,
//         type: Type.COMMIT,
//         originID: 'replacement-test-id',
//       }
//     );
    
//     await repository.storeInformation(updatedDoc);
    
//     // await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const updatedResponse = await lastValueFrom(
//       rabbitClient.send('retrieve.information', { query: 'updated document replaces' })
//     );
    
//     const updatedDocument = updatedResponse.find(doc => doc.metadata.originID === 'replacement-test-id');
//     expect(updatedDocument).toBeDefined();
//     expect(updatedDocument.content).toBe('Updated document that replaces the original');
    
//     const originalQueryResponse = await lastValueFrom(
//       rabbitClient.send('retrieve.information', { query: 'original document' })
//     );
    
//     const hasExactOriginalContent = originalQueryResponse.some(doc => 
//       doc.metadata.originID === 'replacement-test-id' && 
//       doc.content === 'Original document that will be replaced'
//     );
    
//     expect(hasExactOriginalContent).toBe(false);
//   });
// });