import { Test, TestingModule } from '@nestjs/testing';
import { GithubAPIAdapter } from './GithubAPIAdapter.js';
import { GithubAPIFacade } from './GithubAPIFacade.js';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';
import { GithubService } from '../../application/github.service.js';
import { timeout } from 'rxjs';
import { Octokit } from '@octokit/rest';
import { GithubStoreAdapter } from './GithubStoreAdapter.js';
import { QdrantInformationRepository } from './persistance/qdrant-information-repository.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { QdrantVectorStore } from '@langchain/qdrant';
import { NomicEmbeddings } from '@langchain/nomic';
import { QdrantClient } from '@qdrant/js-client-rest';

describe('GithubAPIAdapter Integration Tests', () => {
  let adapter: GithubAPIAdapter;
  let githubAPI: GithubAPIFacade;
  let ghService: GithubService;
  let githubStoreAdapter: GithubStoreAdapter

  beforeEach(() => {
    githubAPI = new GithubAPIFacade(new Octokit({
          auth: process.env.GITHUB_TOKEN || 'your_github_token'
          }));
    adapter = new GithubAPIAdapter(githubAPI);

    
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
          chunkSize: 1000, 
          chunkOverlap: 0 
        });
        
      
    githubStoreAdapter = new GithubStoreAdapter(new QdrantInformationRepository(vectorStore, textSplitter));
    ghService = new GithubService(adapter,adapter,adapter,adapter,adapter,githubStoreAdapter);
  });

  // it('should fetch commits and their modified files', async () => {
  //   const githubCmd = new GithubCmd();
  //   // githubCmd.lastUpdate = new Date(Date.now());
  // //  githubCmd.lastUpdate =  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  //   const repoCmd = new RepoCmd();
  //   repoCmd.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
  //   repoCmd.repoName = process.env.GITHUB_REPO || 'Docs';
  //   repoCmd.branch_name = "develop"
  //   githubCmd.repoCmdList = [repoCmd];
  //   const commits = await adapter.fetchGithubCommitsInfo(githubCmd);
  //   console.log('Fetched commits:', commits);
  //   console.log(commits);
  //   expect(commits).toBeDefined();
  //   expect(Array.isArray(commits)).toBe(true);
  //   if (commits.length > 0) {
  //     expect(commits[0]).toHaveProperty('hash');
  //     expect(commits[0]).toHaveProperty('message');
  //     expect(commits[0]).toHaveProperty('author');
  //     expect(commits[0]).toHaveProperty('files');
  //   }
  // },20000);

  // it('should fetch files with content', async () => {
    
  //   const githubCmd = new GithubCmd();
  //   // githubCmd.lastUpdate = new Date(Date.now());
  //    githubCmd.lastUpdate =  new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  //   const repoCmd = new RepoCmd();
  //   repoCmd.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
  //   repoCmd.repoName = process.env.GITHUB_REPO || 'Docs';
  //   repoCmd.branch_name = "develop"
  //   githubCmd.repoCmdList = [repoCmd];
  //   await ghService.fetchAndStoreGithubInfo(githubCmd);
  //   // const files = await adapter.fetchGithubFilesInfo();
  //   // console.log('Fetched files:', files);
  //   // expect(files).toBeDefined();
  //   // expect(Array.isArray(files)).toBe(true);
  //   // if (files.length > 0) {
  //   //   expect(files[0]).toHaveProperty('path');
  //   //   expect(files[0]).toHaveProperty('sha');
  //   //   expect(files[0]).toHaveProperty('content');
  //   // }
  // });

  // it('should fetch pull requests with all related information', async () => {
  //       const githubCmd = new GithubCmd();
  //   // githubCmd.lastUpdate = new Date(Date.now());
  //   const repoCmd = new RepoCmd();
  //   repoCmd.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
  //   repoCmd.repoName = process.env.GITHUB_REPO || 'Docs';
  //   repoCmd.branch_name = "develop"
  //   const repoCmd2 = new RepoCmd();
  //   repoCmd2.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
  //   repoCmd2.repoName = process.env.GITHUB_REPO || 'Docs';
  //   repoCmd2.branch_name = "master"
  //   githubCmd.repoCmdList = [repoCmd, repoCmd2];
  //   const pullRequests = await adapter.fetchGithubPullRequestsInfo(githubCmd);
  //   console.log('Fetched pull requests:', pullRequests);
  //   console.log(pullRequests.length);
  //   expect(pullRequests).toBeDefined();
  //   expect(Array.isArray(pullRequests)).toBe(true);
  //   if (pullRequests.length > 0) {
  //     expect(pullRequests[0]).toHaveProperty('id');
  //     expect(pullRequests[0]).toHaveProperty('number');
  //     expect(pullRequests[0]).toHaveProperty('title');
  //     expect(pullRequests[0]).toHaveProperty('state');
  //     expect(pullRequests[0]).toHaveProperty('assignees');
  //     expect(pullRequests[0]).toHaveProperty('requested_reviewers');
  //     expect(pullRequests[0]).toHaveProperty('files');
  //   }
  // }, 10000);

 /** correct test
  *   it('should fetch repository information', async () => {
    const githubCmd = new GithubCmd();
    githubCmd.lastUpdate = new Date(Date.now());
    const repoCmd = new RepoCmd();
    repoCmd.owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
    repoCmd.repoName = process.env.GITHUB_REPO || 'Docs';
    repoCmd.branch_name = "master"
    githubCmd.repoCmdList = [repoCmd];

    const repositories = await adapter.fetchGithubRepositoryInfo(githubCmd);
    console.log('Fetched repositories:', repositories);
    expect(repositories).toBeDefined();
    expect(Array.isArray(repositories)).toBe(true);
    if (repositories.length > 0) {
      expect(repositories[0]).toHaveProperty('id');
      expect(repositories[0]).toHaveProperty('name');
      expect(repositories[0]).toHaveProperty('createdAt');
      expect(repositories[0]).toHaveProperty('lastUpdate');
      expect(repositories[0]).toHaveProperty('mainLanguage');
    }
  });

  */

  it('should fetch all the information through service', async () => {
    const owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
    const repoName = process.env.GITHUB_REPO || 'Docs';
    const branch = "master";
    
    const repoCmd = new RepoCmd(owner, repoName, branch);
    const repoCmdList = [repoCmd];
    const githubCmd = new GithubCmd(repoCmdList);
    
    await ghService.fetchAndStoreGithubInfo(githubCmd);
  });
}); 