import { Module } from '@nestjs/common';
import { JiraService } from './application/jira.service.js';
import { ConfluenceService } from './application/confluence.service.js';
import { GithubService } from './application/github.service.js';
import { GITHUB_USECASE } from './application/port/in/GithubUseCase.js';
import { JIRA_API_PORT } from './application/port/out/JiraAPIPort.js';
import { JiraAPIAdapter } from './adapter/out/JiraAPIAdapter.js';
import { JiraAPIFacade } from './adapter/out/JiraAPIRepository.js';
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
import { GithubAPIFacade } from './adapter/out/GithubAPIRepository.js';
import { JIRA_USECASE } from './application/port/in/JiraUseCase.js';
import { CONFLUENCE_USECASE } from './application/port/in/ConfluenceUseCase.js';
import { CONFLUENCE_API_PORT } from './application/port/out/ConfluenceAPIPort.js';
import { ConfluenceAPIAdapter } from './adapter/out/ConfluenceAPIAdapter.js';
import { ConfluenceAPIFacade } from './adapter/out/ConfluenceAPIRepository.js';
import { Octokit } from '@octokit/rest';
import { Version3Client } from 'jira.js';
import { GithubStoreAdapter } from './adapter/out/GithubStoreAdapter.js';
import { ConfluenceStoreAdapter } from './adapter/out/ConfluenceStoreAdapter.js';
import { JiraStoreAdapter } from './adapter/out/JiraStoreAdapter.js';
import { GITHUB_STORE_INFO_PORT } from './application/port/out/GithubStoreInfoPort.js';
import { GITHUB_COMMITS_API_PORT } from './application/port/out/GithubCommitAPIPort.js';
import { GITHUB_FILES_API_PORT } from './application/port/out/GithubFilesAPIPort.js';
import { GITHUB_PULL_REQUESTS_API_PORT } from './application/port/out/GithubPullRequestsAPIPort.js';
import { GITHUB_REPOSITORY_API_PORT } from './application/port/out/GithubRepositoryAPIPort.js';
import { GITHUB_WORKFLOWS_API_PORT } from './application/port/out/GithubWorkflowsAPIPort.js';
import { CONFLUENCE_STORE_INFO_PORT } from './application/port/out/ConfluenceStoreInfoPort.js';
import { JIRA_STORE_INFO_PORT } from './application/port/out/JiraStoreInfoPort.js';
import { GithubFetchAndStoreController } from './adapter/in/GithubFetchAndStoreController.js';
import { JiraFetchAndStoreController } from './adapter/in/JiraFetchAndStoreController.js';
import { ConfluenceFetchAndStoreController } from './adapter/in/ConfluenceFetchAndStoreController.js';

@Module({
  imports: [],
  controllers: [ 
    RetrievalController, 
    GithubFetchAndStoreController,
    JiraFetchAndStoreController,
    ConfluenceFetchAndStoreController
  ],
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
        const qdrantUrl = process.env.QDRANT_URL || "http://qdrant:6333";
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
          chunkSize: 10000, 
          chunkOverlap: 0 
        });
        
        return new QdrantInformationRepository(vectorStore, textSplitter);
      },
    },
    {
      provide: GITHUB_USECASE, 
      useClass: GithubService, 
    },
    {
      provide: GITHUB_COMMITS_API_PORT,
      useClass: GithubAPIAdapter
    },
    {
      provide: GITHUB_FILES_API_PORT,
      useClass: GithubAPIAdapter
    },
    {
      provide: GITHUB_PULL_REQUESTS_API_PORT,
      useClass: GithubAPIAdapter
    },
    {
      provide: GITHUB_REPOSITORY_API_PORT,
      useClass: GithubAPIAdapter
    },
    {
      provide: GITHUB_WORKFLOWS_API_PORT,
      useClass: GithubAPIAdapter
    },
    {
      provide: GITHUB_STORE_INFO_PORT,
      useClass: GithubStoreAdapter
    },
    {
      provide: GithubAPIFacade,
      useFactory: (octokit: Octokit) => {
        return new GithubAPIFacade(octokit);
      },
      inject: [Octokit]
    },
    {
      provide: JIRA_USECASE, 
      useClass: JiraService, 
    },
    {
      provide: JIRA_API_PORT, 
      useClass: JiraAPIAdapter, 
    },
    {
      provide: JiraAPIFacade,
      useFactory: (version3Client: Version3Client) => {
        return new JiraAPIFacade(version3Client);
      },
      inject: [Version3Client]
    },
    {
      provide: JIRA_STORE_INFO_PORT,
      useClass: JiraStoreAdapter
    },
    {
      provide: CONFLUENCE_USECASE,
      useClass: ConfluenceService
    },
    {
      provide: CONFLUENCE_API_PORT,
      useClass: ConfluenceAPIAdapter,
    },
    {
      provide: ConfluenceAPIFacade,
      useFactory: () => {
        return new ConfluenceAPIFacade(
          process.env.CONFLUENCE_BASE_URL || 'your_confluence_url',
          process.env.CONFLUENCE_USERNAME || 'your_confluence_email',
          process.env.ATLASSIAN_API_KEY || 'your_api_key'
        );
      }
    },
    {
      provide: CONFLUENCE_STORE_INFO_PORT,
      useClass: ConfluenceStoreAdapter,
    },
    {
      provide: Octokit,
      useFactory: () => {
          return new Octokit({
          auth: process.env.GITHUB_TOKEN || 'your_github_token'
          });
        }
    },
    {
      provide: Version3Client,
      useFactory: () => {
        return new Version3Client({
          host: process.env.JIRA_HOST || "http://your_host_url",
            authentication: {
              basic: {
                username: process.env.JIRA_EMAIL || 'your_email',
                password: process.env.ATLASSIAN_API_KEY || 'your_api_key',
              },
            },
          });
      }
    }
  ],
})
export class AppModule {}
