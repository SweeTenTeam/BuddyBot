import { Module } from '@nestjs/common';
import { InformationController } from './adapter/in/information.controller';
import { JiraService } from './application/jira.service';
import { ConfluenceService } from './application/confluence.service';
import { GithubService } from './application/github.service';
import { GITHUB_USECASE, GithubUseCase } from 'src/application/port/in/GithubUseCase';
import { JiraAPIPort } from './application/port/out/JiraAPIPort';
import { JiraAPIAdapter } from './adapter/out/JiraAPIAdapter';
import { JiraAPIFacade } from './adapter/out/JiraAPIFacade';
import { JIRA_USECASE } from './application/port/in/JiraUseCase';
import { ConfluenceAPIAdapter } from './adapter/out/ConfluenceAPIAdapter';
import { ConfluenceAPIPort } from './application/port/out/ConfluenceAPIPort';
import { ConfluenceAPIFacade } from './adapter/out/ConfluenceAPIFacade';
import { CONFLUENCE_USECASE } from './application/port/in/ConfluenceUseCase';

@Module({
  imports: [],
  controllers: [InformationController],
  providers: [
    {
      provide: GITHUB_USECASE,
      useClass: GithubService,
    },
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
