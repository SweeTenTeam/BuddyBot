import { Module } from '@nestjs/common';
import { InformationController } from './adapter/in/information.controller';
import { JiraService } from './application/JiraService';
import { ConfluenceService } from './application/ConfluenceService';
import { JiraAPIAdapter } from './adapter/out/JiraAPIAdapter';
import { JiraAPIFacade } from './adapter/out/JiraAPIFacade';

@Module({
  imports: [],
  controllers: [InformationController],
  providers: [JiraService, JiraAPIAdapter, JiraAPIFacade, ConfluenceService],
})
export class AppModule {}
