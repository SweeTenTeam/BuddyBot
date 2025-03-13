import 'dotenv/config';
import { Module } from '@nestjs/common';
import { InformationController } from './adapter/in/information.controller.js';
import { JiraService } from './application/jira.service.js';
import { ConfluenceService } from './application/confluence.service.js';
import { GithubService } from './application/github.service.js';
import { TestController } from './adapter/in/test.controller.js';
import { GITHUB_USECASE, GithubUseCase } from './application/port/in/GithubUseCase.js';
import { JiraAPIPort } from './application/port/out/JiraAPIPort.js';
import { JiraAPIAdapter } from './adapter/out/JiraAPIAdapter.js';
import { JiraAPIFacade } from './adapter/out/JiraAPIFacade.js';
import { RetrievalController } from './adapter/in/retrieval.controller.js';
import { RETRIEVAL_USE_CASE } from './application/port/in/retrieval-usecase.port.js';
import { RetrievalService } from './application/retrieval.servie.js';
import { RETRIEVAL_PORT } from './application/port/out/retrieval-info.port.js';
import { RetrieveAdapter } from './adapter/out/retrieval.adapter.js';
import { QdrantInformationRepository } from './adapter/out/persistance/qdrant-information-repository.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/qdrant';
import { NomicEmbeddings } from '@langchain/nomic';

@Module({
  imports: [],
  controllers: [TestController, RetrievalController],
  providers: [
    {
      provide: RETRIEVAL_USE_CASE, 
      useClass: RetrievalService,
    },
    {
      provide: RETRIEVAL_PORT,
      useClass: RetrieveAdapter,
    },
    {
      provide: QdrantInformationRepository,
      useFactory: () => {
        const qdrantClient = new QdrantClient({ 
          url: process.env.QDRANT_URL || "http://localhost:6333" 
        });
        
        const vectorStore = new QdrantVectorStore( new NomicEmbeddings(), {
          client: qdrantClient,
          collectionName: "information_store",
        });
        
        return new QdrantInformationRepository(vectorStore);
      },
    },
    {
      provide: GITHUB_USECASE, 
      useClass: GithubService, 
    },
    {
      provide: JiraAPIPort, 
      useClass: JiraAPIAdapter, 
    },
    JiraAPIFacade,
  ],
})
export class AppModule {}
