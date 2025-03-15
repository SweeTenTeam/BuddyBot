import { Controller, Inject } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "src/application/port/in/fetchHistory-usecase.port";
import { FecthHistoryService } from "src/application/fetchHistory.service"
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class FetchHistoryController{
    constructor(@Inject(FH_USE_CASE) private readonly FetchHistoryService: FetchHistoryUseCase) {}

    /*TODO
    @MessagePattern()
    async fetchStoricoChat*/ 
    
}