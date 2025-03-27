import { Controller, Inject } from '@nestjs/common';
import { CONFLUENCE_USECASE, ConfluenceUseCase } from '../../application/port/in/ConfluenceUseCase.js';
import { GITHUB_USECASE, GithubUseCase } from '../../application/port/in/GithubUseCase.js';
import { JIRA_USECASE, JiraUseCase } from '../../application/port/in/JiraUseCase.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { MessagePattern } from '@nestjs/microservices';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';

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
  async fetchAndStoreGithubInfo(req: JSON): Promise<boolean> {
    const result = await this.githubService.fetchAndStoreGithubInfo(
      new GithubCmd(),
    );
    return result;
  }

  @MessagePattern('fetchAndStoreJira')
  async fetchAndStoreJiraInfo(req: JSON): Promise<boolean> {
    const result = await this.jiraService.fetchAndStoreJiraInfo(
      new JiraCmd(req),
    );
    return result;
  }

  @MessagePattern('fetchAndStoreConfluence')
  async fetchAndStoreConfluenceInfo(req: JSON): Promise<boolean> {
    const result = await this.confluenceService.fetchAndStoreConfluenceInfo(
      new ConfluenceCmd(),
    );
    return result;
  }
}
