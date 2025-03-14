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
import { JIRA_USECASE } from './application/port/in/JiraUseCase';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [
    {
      provide: JIRA_USECASE, 
      useClass: JiraService, 
    },
    {
      provide: JiraAPIPort, 
      useClass: JiraAPIAdapter, 
    },
    JiraAPIFacade,
  ],
})
export class AppModule {}
