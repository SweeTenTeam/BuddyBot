import { Controller, Inject, Get, Query } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { FecthHistoryService } from "src/application/fetchHistory.service"
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Chat } from "src/domain/chat";
import { FetchRequestDTO } from "./dto/FetchRequestDTO";

@Controller('chats')
export class FetchHistoryController {
  constructor(@Inject(FH_USE_CASE) private readonly FetchHistoryService: FetchHistoryUseCase) { }

  @Get('c1')
  async fetchStoricoChat(@Query() req: FetchRequestDTO): Promise<Chat[]> {
    const chats = await this.FetchHistoryService.fetchStoricoChat(req);
    console.log("Dati trovati nel DB:", chats); // Debug console.log()
    return chats;
  }
  /*
  @MessagePattern('chat_queue')
  async fetchChatHistory(@Payload() data: any): Promise<Chat[]> {
    console.log('Richiesta fetch chat ricevuta:', data);

    const chatHistory = await this.FetchHistoryService.fetchStoricoChat(data);

    return chatHistory;
  }*/
}