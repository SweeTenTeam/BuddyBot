import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CONFLUENCE_USECASE, ConfluenceUseCase } from 'src/application/port/in/ConfluenceUseCase';
import { GITHUB_USECASE, GithubUseCase } from 'src/application/port/in/GithubUseCase';
import { JIRA_USECASE, JiraUseCase } from 'src/application/port/in/JiraUseCase';
import { ConfluenceCmd } from 'src/domain/ConfluenceCmd';
import { GithubCmd } from 'src/domain/GithubCmd';
import { JiraCmd } from 'src/domain/JiraCmd';

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
