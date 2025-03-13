import { Controller, Get } from '@nestjs/common';
import { ConfluenceUseCase } from '../../application/port/in/ConfluenceUseCase.js';
import { GithubUseCase } from '../../application/port/in/GithubUseCase.js';
import { JiraUseCase } from '../../application/port/in/JiraUseCase.js';
import { JiraCmd } from '../../domain/JiraCmd.js';

@Controller()
export class InformationController {
  private readonly githubService: GithubUseCase;
  private readonly jiraService: JiraUseCase;
  private readonly confluenceService: ConfluenceUseCase;

  constructor(
    githubService: GithubUseCase,
    jiraService: JiraUseCase,
    confluenceService: ConfluenceUseCase,
  ) {
    this.githubService = githubService;
    this.jiraService = jiraService;
    this.confluenceService = confluenceService;
  }

  @Get()
  async fetchAndStoreJiraInfo(req: JSON): Promise<boolean> {
    const result = await this.jiraService.fetchAndStoreJiraInfo(
      new JiraCmd(req),
    );
    return result;
  }
}
