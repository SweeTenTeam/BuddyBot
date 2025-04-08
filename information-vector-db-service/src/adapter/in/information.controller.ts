import { Controller, Inject } from '@nestjs/common';
import { CONFLUENCE_USECASE, ConfluenceUseCase } from '../../application/port/in/ConfluenceUseCase.js';
import { GITHUB_USECASE, GithubUseCase } from '../../application/port/in/GithubUseCase.js';
import { JIRA_USECASE, JiraUseCase } from '../../application/port/in/JiraUseCase.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { FetchGithubDto } from './dto/FetchGithub.dto.js';
import { FetchConfluenceDto } from './dto/FetchConfluence.dto.js';
import { FetchJiraDto } from './dto/FetchJira.dto.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';
import { Result } from '../../domain/business/Result.js';

@Controller()
export class InformationController {
  private readonly githubService: GithubUseCase;
  private readonly jiraService: JiraUseCase;
  private readonly confluenceService: ConfluenceUseCase;

  constructor(
    @Inject(GITHUB_USECASE) githubService: GithubUseCase,
    @Inject(JIRA_USECASE) jiraService: JiraUseCase,
    @Inject(CONFLUENCE_USECASE) confluenceService: ConfluenceUseCase,
  ) {
    this.githubService = githubService;
    this.jiraService = jiraService;
    this.confluenceService = confluenceService;
  }

  @MessagePattern('fetchAndStoreGithub')
  async fetchAndStoreGithubInfo(@Payload() req: FetchGithubDto): Promise<Result> {
    try {
      const repoCmdList = req.repoDTOList.map(repoDto => {
         return new RepoCmd(repoDto.owner, repoDto.repoName, repoDto.branch_name); 
      });

      const result = await this.githubService.fetchAndStoreGithubInfo(
        new GithubCmd(repoCmdList, req.lastUpdate ? new Date(req.lastUpdate) : undefined)
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }

  @MessagePattern('fetchAndStoreJira')
  async fetchAndStoreJiraInfo(@Payload() req: FetchJiraDto): Promise<Result> {
    try {
      const result = await this.jiraService.fetchAndStoreJiraInfo(
        new JiraCmd(req.boardId, req.lastUpdate ? new Date(req.lastUpdate) : undefined),
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }

  @MessagePattern('fetchAndStoreConfluence')
  async fetchAndStoreConfluenceInfo(@Payload() req: FetchConfluenceDto): Promise<Result> {
    try {
      const result = await this.confluenceService.fetchAndStoreConfluenceInfo(
        new ConfluenceCmd(req.lastUpdate ? new Date(req.lastUpdate) : undefined),
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }
}
