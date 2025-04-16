import { Controller, Inject, Get, Query } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { FetchRequestDTO } from "./dto/FetchRequestDTO";
import { ChatDTO } from "./dto/ChatDTO";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";

@Controller()
export class FetchHistoryController {
  constructor(@Inject(FH_USE_CASE) private readonly FetchHistoryService: FetchHistoryUseCase) { }
  
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
      result.push(new ChatDTO(chatHistory[i].id,chatHistory[i].question,chatHistory[i].answer,chatHistory[i].lastFetch));
    }
    return result;
  }
}