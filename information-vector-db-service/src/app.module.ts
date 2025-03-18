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
import { RetrievalService } from './application/retrieval.service.js';
import { RETRIEVAL_PORT } from './application/port/out/retrieval-info.port.js';
import { RetrieveAdapter } from './adapter/out/retrieval.adapter.js';
import { QdrantInformationRepository } from './adapter/out/persistance/qdrant-information-repository.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/qdrant';
import { NomicEmbeddings } from '@langchain/nomic';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GithubAPIAdapter } from './adapter/out/GithubAPIAdapter.js';
import { GithubAPIFacade } from './adapter/out/GithubAPIFacade.js';
import { JIRA_USECASE } from './application/port/in/JiraUseCase.js';
import { CONFLUENCE_USECASE } from './application/port/in/ConfluenceUseCase.js';
import { ConfluenceAPIPort } from './application/port/out/ConfluenceAPIPort.js';
import { ConfluenceAPIAdapter } from './adapter/out/ConfluenceAPIAdapter.js';
import { ConfluenceAPIFacade } from './adapter/out/ConfluenceAPIFacade.js';

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
        const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
        console.log(`Connecting to Qdrant at: ${qdrantUrl}`);
                const qdrantClient = new QdrantClient({ 
          url: qdrantUrl
        });
        
        if (!process.env.NOMIC_API_KEY) {
          console.warn('NOMIC_API_KEY is not set. Embeddings will not work properly.');
        }
        
        const vectorStore = new QdrantVectorStore(new NomicEmbeddings(), {
          client: qdrantClient,
          collectionName: "buddybot_info",
        });

        const textSplitter = new RecursiveCharacterTextSplitter({ 
          chunkSize: 1000, 
          chunkOverlap: 0 
        });
        
        return new QdrantInformationRepository(vectorStore, textSplitter);
      },
    },
    {
      provide: GITHUB_USECASE, 
      useClass: GithubService, 
    },
    GithubAPIAdapter,
    GithubAPIFacade,
    {
      provide: JIRA_USECASE, 
      useClass: JiraService, 
    },
    {
      provide: JiraAPIPort, 
      useClass: JiraAPIAdapter, 
    },
    JiraAPIFacade,
    {
      provide: CONFLUENCE_USECASE,
      useClass: ConfluenceService
    },
    {
      provide: ConfluenceAPIPort,
      useClass: ConfluenceAPIAdapter,
    },
    ConfluenceAPIFacade
  ],
})
export class AppModule {}
