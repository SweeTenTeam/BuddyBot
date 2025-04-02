import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { FetchHistoryDto } from './dto/FetchHistory.dto';
import { CreateChatDTO } from './dto/CreateChat.dto';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('/history')
  async sendMessage(@Query('id') id: string) {
    console.log("Trying to send message");
    const wtf = await this.historyService.sendMessage('fetch_queue', new FetchHistoryDto(id,5));
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