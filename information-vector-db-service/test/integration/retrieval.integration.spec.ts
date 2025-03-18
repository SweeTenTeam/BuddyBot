import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { QdrantVectorStore } from '@langchain/qdrant';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RetrievalController } from '../../src/adapter/in/retrieval.controller.js';
import { RetrievalService } from '../../src/application/retrieval.service.js';
import { QdrantInformationRepository } from '../../src/adapter/out/persistance/qdrant-information-repository.js';
import { RetrieveAdapter } from '../../src/adapter/out/retrieval.adapter.js';
import { RETRIEVAL_PORT } from '../../src/application/port/out/retrieval-info.port.js';
import { RETRIEVAL_USE_CASE } from '../../src/application/port/in/retrieval-usecase.port.js';
import { Information } from '../../src/domain/information.js';
import { Metadata, Origin, Type } from '../../src/domain/metadata.js';
import { InformationEntity } from '../../src/adapter/out/persistance/entities/information.entity.js';
import { OriginEntity, TypeEntity } from '../../src/adapter/out/persistance/entities/metadata.entity.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { NomicEmbeddings } from '@langchain/nomic';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import 'dotenv/config';


describe('Retrieval Integration', () => {
  let app: INestApplication;
  let qdrantClient: QdrantClient;
  let vectorStore: QdrantVectorStore;
  let repository: QdrantInformationRepository;
  let rabbitClient: ClientProxy;
  
  // Collection name for testing
  const COLLECTION_NAME = 'test_collection';

  beforeAll(async () => {
    // Get Qdrant URL from environment variables
    const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
    console.log(`Connecting to Qdrant at: ${qdrantUrl}`);
    
    // Create a real Qdrant client
    qdrantClient = new QdrantClient({
      url: qdrantUrl,
    });

    // Try to create a collection for testing
    try {
      await qdrantClient.deleteCollection(COLLECTION_NAME);
    } catch (e) {
      // Collection might not exist yet, which is fine
    }

    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768,
        distance: 'Cosine',
      },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'RABBIT_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: 'information_service_queue',
              queueOptions: {
                durable: true,
              },
            },
          },
        ]),
      ],
      controllers: [RetrievalController],
      providers: [
        {
          provide: QdrantVectorStore,
          useFactory: async () => {
            const embeddings = new NomicEmbeddings();
            const vectorStore = new QdrantVectorStore(embeddings, {
              client: new QdrantClient({ url: qdrantUrl }),
              collectionName: COLLECTION_NAME,
            });
            return vectorStore;
          },
        },
        {
          provide: RecursiveCharacterTextSplitter,
          useFactory: () => {
            return new RecursiveCharacterTextSplitter({
              chunkSize: 768,
            });
          },
        },
        QdrantInformationRepository,
        RetrieveAdapter,
        {
          provide: RETRIEVAL_PORT,
          useExisting: RetrieveAdapter,
        },
        RetrievalService,
        {
          provide: RETRIEVAL_USE_CASE,
          useExisting: RetrievalService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configure the app to use RabbitMQ
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'information_service_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
    
    // Get references to injected services
    vectorStore = moduleFixture.get<QdrantVectorStore>(QdrantVectorStore);
    repository = moduleFixture.get<QdrantInformationRepository>(QdrantInformationRepository);
    rabbitClient = moduleFixture.get('RABBIT_SERVICE');
    
    // Start the microservice
    await app.startAllMicroservices();
    await app.init();
    
    // Wait for RabbitMQ client to connect
    await rabbitClient.connect();
  });

  afterAll(async () => {
    // Clean up the test collection
    try {
      await qdrantClient.deleteCollection(COLLECTION_NAME);
    } catch (e) {
      console.error('Error cleaning up test collection:', e);
    }
    
    // Close RabbitMQ connection
    await rabbitClient.close();
    
    await app.close();
  });

  it('should store and retrieve information through RabbitMQ messaging', async () => {
    // Create test information to store
    const testInfo = new InformationEntity(
      'This is a test document about information retrieval systems and vector databases',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'real-test-id',
      }
    );

    // Store the information
    const storeResult = await repository.storeInformation(testInfo);
    expect(storeResult).toBe(true);
    
    // Give some time for indexing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test retrieving the information through RabbitMQ
    const response = await lastValueFrom(
      rabbitClient.send('retrieve.information', { query: 'information retrieval' })
    );

    console.log(JSON.stringify(response));
      
    // Verify the results
    expect(response.length).toBeGreaterThan(0);
    
    // Find our test document in the results
    const testDocument = response.find(doc => doc.metadata.originID === 'real-test-id');
    expect(testDocument).toBeDefined();
    expect(testDocument.content).toContain('information retrieval');
    expect(testDocument.metadata.origin).toBe(Origin.GITHUB);
    expect(testDocument.metadata.type).toBe(Type.COMMMIT);
  });

  it('should store multiple documents and retrieve the most relevant ones using RabbitMQ', async () => {
  // Create and store multiple test documents
  const testDocuments = [
    new InformationEntity(
      'TypeScript is a strongly typed programming language that builds on JavaScript',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'typescript-doc',
      }
    ),
    new InformationEntity(
      'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'nodejs-doc',
      }
    ),
    new InformationEntity(
      'NestJS is a framework for building efficient, scalable Node.js server-side applications',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'nestjs-doc',
      }
    ),
  ];
  
  // Store all documents
  for (const doc of testDocuments) {
    await repository.storeInformation(doc);
  }
  
  // Give some time for indexing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test retrieving with a query that should match TypeScript using RabbitMQ
  const tsResponse = await lastValueFrom(
    rabbitClient.send('retrieve.information', { query: 'typed programming language' })
  );
    
  // Find our TypeScript document in the results
  const tsDocument = tsResponse.find(doc => doc.metadata.originID === 'typescript-doc');
  expect(tsDocument).toBeDefined();
  
  // Test retrieving with a query that should match Node.js using RabbitMQ
  const nodeResponse = await lastValueFrom(
    rabbitClient.send('retrieve.information', { query: 'javascript runtime' })
  );
    
  // Find our Node.js document in the results
  const nodeDocument = nodeResponse.find(doc => doc.metadata.originID === 'nodejs-doc');
  expect(nodeDocument).toBeDefined();
});

  it('should delete existing documents when storing with the same metadata', async () => {
    // Create initial document
    const originalDoc = new InformationEntity(
      'This is the original content that should be replaced',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'duplicate-test-id',
      }
    );

    // Store the original document
    await repository.storeInformation(originalDoc);
    
    // Give some time for indexing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Make a query that should find the original document
    const originalResults = await repository.retrieveRelevantInfo('original content replaced');
    
    // Verify the original document exists
    expect(originalResults.length).toBeGreaterThan(0);
    expect(originalResults.some(doc => 
      doc.metadata.originID === 'duplicate-test-id' && 
      doc.content.includes('original content')
    )).toBe(true);
    
    // Create updated document with the same metadata but different content
    const updatedDoc = new InformationEntity(
      'This is the updated content that should replace the original',
      {
        origin: OriginEntity.GITHUB,
        type: TypeEntity.COMMMIT,
        originID: 'duplicate-test-id',
      }
    );
    
    // Store the updated document (should delete the original first)
    await repository.storeInformation(updatedDoc);
    
    // Give some time for indexing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Query for both original and updated content
    const updatedResults = await repository.retrieveRelevantInfo('original updated content');
    
    // Verify only the updated document exists
    expect(updatedResults.some(doc => 
      doc.metadata.originID === 'duplicate-test-id' && 
      doc.content.includes('updated content')
    )).toBe(true);
    
    // Ensure the original content is no longer retrievable
    const originalContentQuery = await repository.retrieveRelevantInfo('original content that should be replaced');
    const hasOriginalContent = originalContentQuery.some(doc => 
      doc.metadata.originID === 'duplicate-test-id' && 
      doc.content.includes('original content') &&
      !doc.content.includes('updated content')
    );
    
    expect(hasOriginalContent).toBe(false);
  });
});