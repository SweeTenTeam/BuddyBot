import { Controller, Inject, Get, Query } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { FecthHistoryService } from "src/application/fetchHistory.service"
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Chat } from "src/domain/chat";
import { FetchRequestDTO } from "./dto/FetchRequestDTO";

@Controller('api/chat')
export class FetchHistoryController {
  constructor(@Inject(FH_USE_CASE) private readonly FetchHistoryService: FetchHistoryUseCase) { }
  /*
  @Get('get')
  async fetchStoricoChat(@Query() req: FetchRequestDTO): Promise<Chat[]> {
    const chats = await this.FetchHistoryService.fetchStoricoChat(req);
    console.log("Dati trovati nel DB:", chats); // Debug console.log()
    return chats;
  }*/
  
  @MessagePattern('fetch_queue')
  async fetchChatHistory(@Payload() data: FetchRequestDTO): Promise<Chat[]> {
    console.log('Richiesta fetch chat ricevuta:', data);

    const chatHistory = await this.FetchHistoryService.fetchStoricoChat(data);

    console.log(chatHistory); //da rimuovere questa riga quando microserv è pronto
    return chatHistory;
  }
}

/* richiesta fetch simulata
{
  "pattern": "fetch_queue",
  "data": {
    "id": "5f65bb56-3e14-4978-9c79-9cd853790579",
    "numChat":"2"
  }
}
*/