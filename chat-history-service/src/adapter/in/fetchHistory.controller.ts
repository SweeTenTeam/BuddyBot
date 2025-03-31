import { Controller, Inject, Get, Query } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { FetchHistoryService } from "src/application/fetchHistory.service"
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Chat } from "src/domain/chat";
import { FetchRequestDTO } from "./dto/FetchRequestDTO";
import { ChatDTO } from "./dto/ChatDTO";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";

@Controller()
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
  async fetchChatHistory(@Payload() data: FetchRequestDTO): Promise<ChatDTO[]> {
    console.log('Richiesta fetch chat ricevuta:', data);

    const fetchHistoryCmd: FetchHistoryCmd = {
      id: data.id,
      numChat: data.numChat
    }
    const chatHistory = await this.FetchHistoryService.fetchStoricoChat(fetchHistoryCmd);
    const result: ChatDTO[] = [];
    for(let i=0; i<chatHistory.length; i++){
      result.push(new ChatDTO(chatHistory[i].id,chatHistory[i].question,chatHistory[i].answer));
    }
    console.log(result); //da rimuovere questa riga quando microserv è pronto
    return result;
  }
}

/* richiesta fetch simulata rmq
{
  "pattern": "fetch_queue",
  "data": {
    "id": "5f65bb56-3e14-4978-9c79-9cd853790579",
    "numChat":"2"
  }
}
*/