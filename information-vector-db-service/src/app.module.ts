import { Module } from '@nestjs/common';
import { InformationController } from './adapter/in/information.controller';
import { JiraService } from './application/jira.service';
import { ConfluenceService } from './application/confluence.service';
import { GithubService } from './application/github.service';
import { TestController } from './adapter/in/test.controller';
import { GITHUB_USECASE, GithubUseCase } from 'src/application/port/in/GithubUseCase';
import { JiraAPIPort } from './application/port/out/JiraAPIPort';
import { JiraAPIAdapter } from './adapter/out/JiraAPIAdapter';
import { JiraAPIFacade } from './adapter/out/JiraAPIFacade';
import { RetrievalController } from './adapter/in/retrieval.controller';
import { RETRIEVAL_USE_CASE } from './application/port/in/retrieval-usecase.port';
import { RetrievalService } from './application/retrieval.servie';
import { RETRIEVAL_PORT } from './application/port/out/retrieval-info.port';
import { RetrieveAdapter } from './adapter/out/retrieval.adapter';
import { QdrantInformationRepository } from './adapter/out/persistance/qdrant-information-repository';
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
    QdrantInformationRepository,
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
