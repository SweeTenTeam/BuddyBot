import { Controller, Get, Body, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { FetchGithubDto } from './FetchGithubDto';
import { FetchJiraDto } from './FetchJiraDto';
import { FetchConfluenceDto } from './FetchConfluenceDto';

@Controller()
export class MessageController {
  constructor(private readonly producerService: ProducerService) {}

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

  @Post()
  async sendMessagewtf() {
    const wtf = await this.producerService.sendMessage('wtf_pattern', 'ziopera');
    console.log(wtf);
    return 'Message sent siuu!';
  }
}