import { Controller, Get, Body, Post } from '@nestjs/common';
import { InformationService } from './information.service';
import { FetchGithubDto } from './dto/FetchGithub.dto';
import { FetchJiraDto } from './dto/FetchJira.dto';
import { FetchConfluenceDto } from './dto/FetchConfluence.dto';
import { RetrieveCmd } from './cmd/RetrieveCmd';

@Controller()
export class InformationController {
  constructor(private readonly producerService: InformationService) {}

  @Get('/retrieve')
  async retrieve() {
    const wtf = await this.producerService.sendMessage('retrieve.information', new RetrieveCmd('Can you tell me the latest commits?'));
    console.log(wtf);
    return 'Message sent!';
  }

  @Get('/github')
  async sendMessage() {
    const wtf = await this.producerService.sendMessage('fetchAndStoreGithub', new FetchGithubDto('2003-01-22'));
    console.log(wtf);
    return 'Message sent!';
  }

  @Get('/jira')
  async sendJiraMessage() {
    const wtf = await this.producerService.sendMessage('fetchAndStoreJira', new FetchJiraDto(1,'2003-01-22'));
    console.log(wtf);
    return 'Message sent!';
  }

  @Get('/confluence')
  async sendConfluenceMessage() {
    const wtf = await this.producerService.sendMessage('fetchAndStoreConfluence', new FetchConfluenceDto('2003-01-22'));
    console.log(wtf);
    return 'Message sent!';
  }
}