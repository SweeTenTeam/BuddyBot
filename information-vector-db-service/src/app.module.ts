import { Module } from '@nestjs/common';
import { InformationController } from './adapter/in/information.controller';
import { JiraService } from './application/jira.service';
import { ConfluenceService } from './application/confluence.service';
import { GithubService } from './application/github.service';
import { TestController } from './adapter/in/test.controller';
import { GithubUseCase } from 'src/application/port/in/GithubUseCase';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [GithubService],
})
export class AppModule {}
