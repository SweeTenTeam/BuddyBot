import { Controller, Get, Body, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { FetchHistoryDto } from './dto/FetchHistory.dto';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('/history')
  async sendMessage() {
    console.log("Trying to send message");
    const wtf = await this.historyService.sendMessage('fetch_queue', new FetchHistoryDto("7a85a871-e511-4838-91a5-3e0cf3c338a7",5));
    console.log(wtf);
    return 'Message sent!';
  }
}