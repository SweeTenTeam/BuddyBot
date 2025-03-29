import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { FetchHistoryDto } from './dto/FetchHistory.dto';
import { CreateChatDTO } from './dto/CreateChat.dto';

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

  @Get('/insertChat')
  async createMessage(@Query('question') question: string, @Query('answer') answer: string) {
    console.log("Trying to create message");
    const wtf = await this.historyService.sendMessage('chat_message', new CreateChatDTO(question,new Date(),answer));
    console.log(wtf);
    return 'Message sent!';
  }
}