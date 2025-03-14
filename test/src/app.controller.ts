import { Controller, Get, Body, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  async sendMessage() {
    const wtf = await this.producerService.sendMessage('fetchAndStoreConfluence', 'ziomela');
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