import { Controller, Get } from '@nestjs/common';
import { ConfluenceUseCase } from 'src/application/port/in/ConfluenceUseCase';
import { GithubUseCase } from 'src/application/port/in/GithubUseCase';
import { JiraUseCase } from 'src/application/port/in/JiraUseCase';
import { JiraCmd } from 'src/domain/JiraCmd';

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
