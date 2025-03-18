import { Controller, Inject, Get, Query } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { FecthHistoryService } from "src/application/fetchHistory.service"
import { MessagePattern } from "@nestjs/microservices";
import { Chat } from "src/domain/chat";
import { FetchRequestDTO } from "./dto/FetchRequestDTO";

@Controller('chats')
export class FetchHistoryController{
    constructor(@Inject(FH_USE_CASE) private readonly FetchHistoryService: FetchHistoryUseCase) {}

    @Get('c1')
    async fetchStoricoChat(@Query() req: FetchRequestDTO): Promise<Chat[]> {
      const chats = await this.FetchHistoryService.fetchStoricoChat(req);
      console.log("Dati trovati nel DB:", chats); // Debug console.log()
      return chats;
    }

    /*TODO
    @MessagePattern()
    async fetchStoricoChat*/ 
    
}